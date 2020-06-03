import os
import textract
import concurrent.futures
from tika import parser
import json
import spacy
from spacy.matcher import PhraseMatcher
from candidates.scanner.train_spacy_ner import summarize_text


def get_pdf_content_tika(pdf_filename, save_path='cv/converted_cvs_to_txt/cvs'):
    text_filename = os.path.join(save_path, pdf_filename.split("\\")[-1].split(".")[0] + ".txt")
    f = open(text_filename, "w", encoding='utf-8')
    parsed_pdf = parser.from_file(pdf_filename)
    pdf_text = parsed_pdf['content']
    f.write(pdf_text.replace('\n', ''))
    f.close()


def get_word_content(word_filename, save_path='cv/converted_cvs_to_txt/cvs'):
    word_file_path = word_filename.replace("\\", "/")
    word_filename = word_file_path.split("/")[-1]
    text = str(textract.process(word_file_path)).replace("b\"", "").replace("b'", "").replace("\\n", " ").replace("\\t", " ")[:-1]
    text_filename = os.path.join(save_path, word_filename.split(".")[0] + ".txt")
    f = open(text_filename, "w")
    f.write(str(text))
    f.close()


def convert_file(path):
    """
    Converts the file with the given path to .txt
    :param path: Path to the documented that has to be converted
    :return: -
    """
    cv_name = path.split("\\")[-1]
    cv_type = cv_name.split(".")[-1]
    if cv_type == "pdf":
        get_pdf_content_tika(path)
    if cv_type == "docx":
        get_word_content(path)
    if cv_type == "doc":
        print("Doc format will not be processed!")


def go_through_dir(root_dir):
    """
    Goes through all CVs in the given directory and splits the work to 5 threads resulting in the conversion them all
    :param root_dir: Directory where all CVs are stored
    :return: -
    """
    all_files = []
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            path = os.path.join(subdir, file)
            print(path)
            all_files.append(path)
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        map(lambda x: executor.submit(convert_file, x), all_files)


def go_through_dir_and_summarize(root_dir):
    all_files = []
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            path = os.path.join(subdir, file)
            all_files.append(path)
            # summarize_text(path)
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        result_futures = list(map(lambda x: executor.submit(summarize_text, x), all_files))
        results = [f.result() for f in concurrent.futures.as_completed(result_futures)]


def get_json_content(filename_path):
    with open(filename_path, 'r', encoding="utf8") as f:
        lines = f.readlines()
    file_data = lines[0].replace("}{", "},{")
    file_data = "[" + file_data + "]"
    all_skills = json.loads(file_data)
    return all_skills


def phrase_matcher(text=None, skills_path='cv/skills/cleaned_related_skills.json'):

    nlp = spacy.load('en_core_web_sm')  # Language class with the English model 'en_core_web_sm' is loaded
    matcher = PhraseMatcher(nlp.vocab, attr='LOWER')  # create the PhraseMatcher object
    terminology_list = []

    all_skills = get_json_content(skills_path)
    for skill in all_skills:
        terminology_list.append(skill['name'])  # the list containing the pharses to be matched

    # convert the phrases into document object using nlp.make_doc to #speed up.
    patterns = [nlp.make_doc(text) for text in terminology_list]
    matcher.add("Phrase Matching", None, *patterns)  # add the patterns to the matcher object without any callbacks

    doc = nlp(text)

    matches = matcher(doc)
    matched_skills = []

    for match_id, start, end in matches:
        string_id = nlp.vocab.strings[match_id]  # Get the string representation
        span = doc[start:end]  # The matched span
        matched_skills.append((match_id, string_id, start, end, span.text.lower()))
    return matched_skills

