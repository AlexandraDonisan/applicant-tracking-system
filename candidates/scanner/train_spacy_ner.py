import spacy
import json
import random
import logging
import os
from sklearn.metrics import precision_recall_fscore_support
from sklearn.metrics import accuracy_score
from spacy.gold import GoldParse
from spacy.util import minibatch, compounding


def convert_doccano_to_spacy(json_file_path):
    try:
        training_data = []
        lines = []
        with open(json_file_path, 'r', encoding="utf8") as f:
            lines = f.readlines()
        for line in lines:
            data = json.loads(line)
            text = data['text']
            labels = data['labels']
            training_data.append((text, {"entities": labels}))
        return training_data

    except Exception as e:
        logging.exception("Unable to process" + json_file_path + "\n" + "error = " + str(e))
        return None


def write_summarized_doc_to_file(text_filename, nlp, text):
    f = open(text_filename, "w", encoding="utf-8")
    doc_to_test = nlp(text)
    d = {}
    for ent in doc_to_test.ents:
        d[ent.label_] = []
    for ent in doc_to_test.ents:
        d[ent.label_].append(ent.text)

    for i in set(d.keys()):

        f.write("\n\n")
        f.write(i + ":" + "\n")
        for j in set(d[i]):
            f.write(j.replace('\n', '') + "\n")

    return doc_to_test


def train_spacy(train_data, test_data, model="en_core_web_sm", iterations=20):
    """Set up the pipeline and entity recognizer, and train the new entity."""
    random.seed(0)
    if model is not None:
        nlp = spacy.load(model)  # load existing spaCy model
        print("Loaded model '%s'" % model)
    else:
        nlp = spacy.blank("en")  # create blank Language class
        print("Created blank 'en' model")

    # Add entity recognizer to model if it's not in the pipeline
    # nlp.create_pipe works for built-ins that are registered with spaCy
    if "ner" not in nlp.pipe_names:
        ner = nlp.create_pipe("ner")
        nlp.add_pipe(ner)
    # otherwise, get it, so we can add labels to it
    else:
        ner = nlp.get_pipe("ner")

    # add labels
    # Adding extraneous labels shouldn't mess anything up
    for _, annotations in train_data:
        for ent in annotations.get('entities'):
            ner.add_label(ent[2])

    # get names of other pipes to disable them during training
    if model is None:
        optimizer = nlp.begin_training()
    else:
        optimizer = nlp.resume_training()
    # get names of other pipes to disable them during training
    pipe_exceptions = ["ner", "trf_wordpiecer", "trf_tok2vec"]
    other_pipes = [pipe for pipe in nlp.pipe_names if pipe not in pipe_exceptions]
    with nlp.disable_pipes(*other_pipes):  # only train NER
        sizes = compounding(1.0, 4.0, 1.001)
        for itn in range(iterations):
            print("Starting iteration " + str(itn))
            random.shuffle(train_data)
            # batch up the examples using spaCy's minibatch
            batches = minibatch(train_data, size=sizes)
            losses = {}
            for batch in batches:
                texts, annotations = zip(*batch)
                nlp.update(
                    texts,
                    annotations,
                    drop=0.2,  # dropout - make it harder to memorise data
                    sgd=optimizer,  # callable to update weights
                    losses=losses)
            print(losses)
        test_spacy(test_data, nlp)
    return nlp


def test_spacy(test_data, nlp, save_path='cv/summerized_cvs_with_spacy'):
    # test the model and evaluate it
    resume_number = 0

    for text, annot in test_data:
        text_filename = os.path.join(save_path, "resume" + str(resume_number) + ".txt")

        doc_to_test = write_summarized_doc_to_file(text_filename, nlp, text)

        d = {}
        for ent in doc_to_test.ents:
            d[ent.label_] = [0, 0, 0, 0, 0, 0]
        for ent in doc_to_test.ents:
            doc_gold_text = nlp.make_doc(text)
            gold = GoldParse(doc_gold_text, entities=annot.get("entities"))
            y_true = [ent.label_ if ent.label_ in x else 'Not ' + ent.label_ for x in gold.ner]
            y_pred = [x.ent_type_ if x.ent_type_ == ent.label_ else 'Not ' + ent.label_ for x in doc_to_test]
            if d[ent.label_][0] == 0:
                # f.write("For Entity "+ent.label_+"\n")
                # f.write(classification_report(y_true, y_pred)+"\n")
                (p, r, f, s) = precision_recall_fscore_support(y_true, y_pred, average='weighted')
                a = accuracy_score(y_true, y_pred)
                d[ent.label_][0] = 1
                d[ent.label_][1] += p
                d[ent.label_][2] += r
                d[ent.label_][3] += f
                d[ent.label_][4] += a
                d[ent.label_][5] += 1
        resume_number += 1
    for i in d:
        print("\n For Entity " + i + "\n")
        print("Accuracy : " + str((d[i][4] / d[i][5]) * 100) + "%")
        print("Precision : " + str(d[i][1] / d[i][5]))
        print("Recall : " + str(d[i][2] / d[i][5]))
        print("F-score : " + str(d[i][3] / d[i][5]))

    return nlp


def save_model(nlp):
    # Save our trained Model
    model_file = input("Enter your Model Name: ")
    nlp.to_disk(model_file)
    return model_file


def summarize_text(filename, save_path='cv/summarized_cvs_with_spacy', model_name="cv_tagger"):
    # test the model and evaluate it
    # print('{} file is being processed'.format(filename))
    with open(filename, 'r', encoding='utf-8') as F:
        text = F.read()
    cv_name = filename.split('\\')[-1].split('.')[0]
    nlp = spacy.load(model_name)
    resume_number = 0

    if cv_name:
        cv_name = cv_name.split("\\")[-1]
        text_filename = os.path.join(save_path, cv_name + "_Summarized" + ".txt")
    else:
        text_filename = os.path.join(save_path, "resume" + str(resume_number) + ".txt")

    write_summarized_doc_to_file(text_filename, nlp, text)


def main_train():
    train_data = convert_doccano_to_spacy("train.json")
    test_data = convert_doccano_to_spacy("test.json")
    trained_nlp = train_spacy(train_data, test_data, "en_core_web_sm", 30)
    model_file = save_model(trained_nlp)
    return model_file


def main():
    train = False
    if train:
        model_file = main_train()
        print("The model {} has been saved!".format(model_file))
    else:
        filename = 'cv/converted_cvs_to_txt/cvs/Andy Li Shuoyan.txt'
        summarize_text(filename)


# main()