import datetime
import os
import nltk
import string
import concurrent.futures
from nltk.corpus import stopwords
from nltk.tokenize import WordPunctTokenizer
from sklearn.feature_extraction.text import TfidfVectorizer

import candidates.scanner.utils as utils

# nltk.download('punkt')  # first-time use only
# nltk.download('wordnet')  # first-time use only

lemmer = nltk.stem.WordNetLemmatizer()


def convert_documents_to_txt(path):
    """
    :param path: Path where the document in format .pdf or .docx are placed
                e.g r"LICENCE/TrainSpacyNER/job_description"
    :return: Convert all documents found in the path into .txt and add them into a common directory
    """
    utils.go_through_dir(path)


def clean_document(doc):
    """
    :param doc: body of the document
    :return: list of words from the document. The stopwords and punctuation/special characters have been eliminated.
        The words are lemmatized
    """
    stop_words = set(stopwords.words('english'))
    special_characters = '•—o'
    lemmer = nltk.stem.WordNetLemmatizer()
    tokens = WordPunctTokenizer().tokenize(doc)
    clean = [token.lower() for token in tokens if token.lower() not in stop_words
             and len(token) != 2 and token not in string.punctuation and token not in special_characters]
    final = [lemmer.lemmatize(word) for word in clean]
    return final


def cosine_similarity(text_list):
    """
    :param text_list: the list containing the tokenized text(i.e. all words from the text as elements of the list
    :return: similarity matrix having 1s on the main diagonal and the values of the TF-IDF vetorizer on the indexes
    correspinding to each CV number
    """
    tf_idf = TfidfVectorizer(tokenizer=clean_document).fit_transform(text_list)
    return (tf_idf * tf_idf.T).toarray()


def get_elements_above_diagonal(matrix):
    """
    :param matrix: similarity matrix computed in compute_similarity_of_all_cvs() method
    :return: dict having as key the values above the main diagonal and as value a list with its indexes
            e.g {0.65: [2,4], 0.75: [2,5]}
    """
    values_and_indexes = {}
    for i in range(len(matrix)):
        for j in range(i + 1, len(matrix)):
            values_and_indexes[matrix[i, j]] = [i, j]
    return values_and_indexes


def compute_similarity_of_all_cvs(root_dir, job_description_file_dir):
    """
        :param root_dir: Directory where all the CVs in .txt format are placed
        :param job_description_file_dir: the path to the Job description .txt file, including its name.txt
        :return: matrix of similarity, dict having as key the CV number and as value the name
        """
    with open(job_description_file_dir, 'r') as F:
        job_description = F.read()
    job_description_name = job_description_file_dir.split("/")[-1]
    documents = [job_description]
    position_and_cv_name = {0: job_description_name}

    for subdir, dirs, files in os.walk(root_dir):
        cv_number = 1
        for file in files:
            path = os.path.join(subdir, file)
            cv_name = path.split("\\")[-1]
            with open(path, 'r', errors='ignore') as cv_file:
                cv = cv_file.read()
            documents.append(cv)
            position_and_cv_name[cv_number] = cv_name
            cv_number += 1
    similarity_matrix = cosine_similarity(documents)
    return similarity_matrix, position_and_cv_name


def get_top_similar_cvs(similarities_matrix, cv_and_position, number=3):
    """
    :param similarities_matrix: matrix result from the cosine similarities algorithm
    :param cv_and_position: dict having as key the cv number ( the n-th cv that entered the scanning in the
        compute_similarity_of_all_cvs() method) and as value the cv name
    :param number: top "n" CVs
    :return: dict{top_number : [cv1_name, cv2_name]} e.g. {0: ['cv1.txt', 'cv2.txt', 0.6], 1: ['cv3.txt', 'cv4.t', 0.5]}
    """
    number = len(cv_and_position) - 1 if number > len(cv_and_position) else number
    import heapq
    top = {}
    values_and_indexes = get_elements_above_diagonal(similarities_matrix)
    maximum = heapq.nlargest(number, values_and_indexes)
    top_n_most_similar = sorted(maximum, reverse=True)
    for n in range(number):
        index_cv_1 = values_and_indexes[top_n_most_similar[n]][0]
        index_cv_2 = values_and_indexes[top_n_most_similar[n]][1]
        percent = float("{:.2f}".format(top_n_most_similar[n]*100))
        top[n] = [cv_and_position[index_cv_1].split('.')[0].replace('_', ' '),
                  cv_and_position[index_cv_2].split('.')[0].replace('_', ' '), str(percent)+"%"]

    return top


def get_skill_and_frequency(matched_skills):
    """
    :param matched_skills: list of skills that are found both in the CV and Job Description
    :return: dict having as key teh skill name and as value the number of occurrences
    """
    skill_and_frequency_dict = {}
    for skill in matched_skills:
        skill_name = skill[4]
        skill_and_frequency_dict[skill_name] = 1 if skill_name not in skill_and_frequency_dict \
            else skill_and_frequency_dict[skill_name] + 1
    return skill_and_frequency_dict


def get_matching_skills(job_skills, cv_skills):
    """
        :param job_skills: list of skills from Job Description
        :param cv_skills: list of skills from CV
        :return: Skills from the Job Description that are found in the CV
        """
    common_skills = job_skills.keys() & cv_skills.keys()  # find common skills from job description and CV
    common_skills = sorted(common_skills)
    return common_skills


def get_missing_skills(job_skills, cv_skills):
    """
    :param job_skills: list of skills from Job Description
    :param cv_skills: list of skills from CV
    :return: Skills from the Job Description that are not found in the CV
    """
    job_set = set(job_skills.items())
    cv_set = set(cv_skills.items())

    missing_skills_set = job_set - cv_set
    missing_skills = []
    for skill in missing_skills_set:
        missing_skills.append(skill[0])
    return missing_skills


def compute_cv_score(common_skills, keywords=None, default_score=None):
    """
    :param common_skills: list of skills that are found both in  CV and the Job Description
    :param keywords: dict having as key a keyword and as value its weight/score
                    e.g.:  keywords = {'accounting': 100, 'audit': 80}
    :param default_score: the default score for words that are not weighted in keywords dict
    :return: the sum of the scores for each word/skill
    """
    # TODO: Remove hardcoded keywords and default score
    keywords = {'accounting': 100, 'audit': 80, 'control': 60, 'excel': 95}
    default_score = 30
    final_score = 0
    for skill in common_skills:
        final_score = final_score + keywords[skill] if skill in keywords.keys() else final_score + default_score
    return final_score


def for_threads(path):
    with open(path, 'r', errors='ignore') as cv_file:
        cv = cv_file.read()
    cv_name = cv_file.name.split("\\")[-1]
    cv_skills = get_skill_and_frequency(utils.phrase_matcher(cv))
    return cv_skills, cv_name


def get_skills_and_score_for_all_cvs(root_dir, job_description_file_dir):
    """
    :param root_dir: Directory where all the CVs in .txt format are placed
    :param job_description_file_dir: the path to the Job description .txt file, including its name.txt
    :return: dict having as key the CV name and as value {'cv_name': [[common_skills], [missing_skills], score]}
    """
    with open(job_description_file_dir, 'r') as F:
        job_description = F.read()

    start_time = datetime.datetime.now()
    job_skills = get_skill_and_frequency(utils.phrase_matcher(job_description))
    cvs_with_skills_and_score = {}
    to_be_computed_files = []

    no_of_cvs = 0
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            path = os.path.join(subdir, file)
            no_of_cvs += 1
            to_be_computed_files.append(path)

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        result_futures = list(map(lambda x: executor.submit(for_threads, x), to_be_computed_files))
        results = [f.result() for f in concurrent.futures.as_completed(result_futures)]

    for result in results:
        cv_skills = result[0]
        cv_name = result[1]
        common_skills = get_matching_skills(job_skills, cv_skills)
        missing_skills = get_missing_skills(job_skills, cv_skills)
        score = compute_cv_score(common_skills)
        print("SCORE FOR CV {} IS: {} \n".format(cv_name, score))
        string_common_skills = " ".join(common_skills)
        string_missing_skills = " ".join(missing_skills)
        cvs_with_skills_and_score[cv_name] = [string_common_skills, string_missing_skills, score]

    end_time = datetime.datetime.now()

    print("The processing of {} cvs has taken {} seconds".format(no_of_cvs, end_time - start_time))
    return cvs_with_skills_and_score


