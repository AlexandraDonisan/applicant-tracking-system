import os
import textract
import concurrent.futures
from tika import parser
import json
import spacy
from spacy.matcher import PhraseMatcher
from candidates.scanner.train_spacy_ner import summarize_text


def get_pdf_content_tika(pdf_filename, save_path='cv/converted_cvs_to_txt/cvs'):
    """
    Converts the given PDF file to .txt format and saves it to the save_path
    :param pdf_filename: Name of the pdf file(with termination e.g: .pdf)
    :param save_path: Path to the location where the converted will be saved
    :return: -
    """
    text_filename = os.path.join(save_path, pdf_filename.split("\\")[-1].split(".")[0] + ".txt")
    f = open(text_filename, "w", encoding='utf-8')
    parsed_pdf = parser.from_file(pdf_filename)
    pdf_text = parsed_pdf['content']
    f.write(pdf_text.replace('\n', ''))
    f.close()


def get_word_content(word_filename, save_path='cv/converted_cvs_to_txt/cvs'):
    """
    Converts the given DOCX file to .txt format and saves it to the save_path
    :param word_filename: Name of the doc file(with termination e.g: .docx)
    :param save_path: Path to the location where the converted will be saved
    :return: -
    """
    word_file_path = word_filename.replace("\\", "/")
    word_filename = word_file_path.split("/")[-1]
    text = str(textract.process(word_file_path)).replace("b\"", "").replace("b'", "").replace("\\n", " ").replace("\\t", " ")[:-1]
    text_filename = os.path.join(save_path, word_filename.split(".")[0] + ".txt")
    f = open(text_filename, "w")
    f.write(str(text))
    f.close()


def list_all_files_from_dir(root_dir):
    """
    :param root_dir: Directory where there are several files
    :return: A list containing all files existing in the given directory
    """
    all_files = []

    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            path = os.path.join(subdir, file)
            all_files.append(path)

    return all_files


def convert_file(path, save_path='cv/converted_cvs_to_txt/cvs'):
    """
    Converts the file with the given path to .txt
    :param save_path: The location where the converted document will be saved
    :param path: Path to the documented that has to be converted
    :return: -
    """
    cv_name = path.split("\\")[-1]
    # print("CV name in convert: {}".format(cv_name))
    cv_type = cv_name.split(".")[-1]
    if cv_type == "pdf":
        get_pdf_content_tika(path, save_path)
    if cv_type == "docx":
        get_word_content(path, save_path)
    if cv_type == "doc":
        print("Doc format will not be processed!")


def go_through_dir(root_dir, save_path='cv/converted_cvs_to_txt/cvs'):
    """
    Goes through all CVs in the given directory and splits the work to 5 threads resulting in the conversion them all
    :param root_dir: Directory where all CVs are stored
    :param save_path: The location where the converted document will be saved
    :return: -
    """
    all_files = []
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            path = os.path.join(subdir, file)
            print(path)
            all_files.append(path)
            convert_file(path, save_path)
    # with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    #     result_futures = list(map(lambda x: executor.submit(convert_file, x), all_files))
    #     results = [f.result() for f in concurrent.futures.as_completed(result_futures)]


def go_through_dir_and_summarize(root_dir):
    """
    For all existing CVs in the given directory, compute summary of text by sharing the work among threads
    :param root_dir: Directory where all CVs are stored
    :return: -
    """
    all_files = list_all_files_from_dir(root_dir)

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        result_futures = list(map(lambda x: executor.submit(summarize_text, x), all_files))
        results = [f.result() for f in concurrent.futures.as_completed(result_futures)]


def get_json_content(filename_path):
    """
    :param filename_path: Path to the JSON file
    :return: JSON content of the given document
    """
    with open(filename_path, 'r', encoding="utf8") as f:
        lines = f.readlines()
    file_data = lines[0].replace("}{", "},{")
    file_data = "[" + file_data + "]"
    all_skills = json.loads(file_data)
    return all_skills


def phrase_matcher(text=None, skills_path='cv/skills/cleaned_related_skills.json'):
    """

    :param text: Text that is going to be parsed
    :param skills_path: Path to the list of skills
    :return: List of tuples having on the 4th position the skill from the JSON document that is found in the given text
            e.g. [(11356100181062323261, 'Phrase Matching', 324, 325, 'client'),
            (11356100181062323261, 'Phrase Matching', 316, 317, 'analysis')]
    """
    nlp = spacy.load('en_core_web_sm')  # Language class with the English model 'en_core_web_sm' is loaded
    matcher = PhraseMatcher(nlp.vocab, attr='LOWER')  # create the PhraseMatcher object
    terminology_list = []

    all_skills = get_json_content(skills_path)
    for skill in all_skills:
        terminology_list.append(skill['name'])  # the list containing the phrases to be matched

    # convert the phrases into document object using nlp.make_doc to #speed up.
    patterns = [nlp.make_doc(text) for text in terminology_list]
    matcher.add("Phrase Matching", None, *patterns)  # add the patterns to the matcher object without any callbacks

    doc = nlp(text)

    matches = matcher(doc)
    matched_skills = []

    for match_id, start, end in matches:   # start and stop indexes of the matched words
        string_id = nlp.vocab.strings[match_id]  # Get the string representation
        span = doc[start:end]  # The matched span
        matched_skills.append((match_id, string_id, start, end, span.text.lower()))
    return matched_skills

