import os

def get_transcripts(pulse_names_output_file):
    """
    Returns a list of all transcripts that appear in order from
    original PULSE output.

    :param pulse_names_output_file
    :return: transcripts_list
    """
    pulse_output = open(pulse_names_output_file, 'r')
    transcript_list = []
    for line in pulse_output:
        transcript = line.split(";")[0].strip("\"").split("\"")[1]
        transcript_list.append(transcript)
    return transcript_list


def get_proteins(pulse_names_output_file):
    """
    Returns a list of all proteins that appear in order from
    original PULSE output.

    :param pulse_names_output_file:
    :return:
    """
    pulse_output = open(pulse_names_output_file, "r")
    protein_list = []
    for line in pulse_output:
        protein = line.split("//")[-1].strip()
        protein_list.append(protein)
    return protein_list


def get_scores(pulse_scores_output_file):
    """
    Returns a list of all proteins' scores that appear
    in the order from pulse output.

    :param pulse_scores_output_file:
    :return:
    """
    pulse_scores = open(pulse_scores_output_file, "r")
    score_list = []
    for line in pulse_scores:
        score = line.strip()
        score_list.append(score)
    return score_list

if __name__ == "__main__":
    transcript_list = get_transcripts('data/names.txt')
    protein_list = get_proteins('data/names.txt')
    score_list = get_scores('data/pulse_output.txt')

    # Combine two lists
    # index_list = [i for i in range(0, len(protein_list) - 1)]
    protein_to_score = zip(protein_list, score_list)
    transcripts_to_score = zip(transcript_list, score_list)

    transcript_to_protein_to_score = zip(transcript_list, protein_list, score_list)

    # Sort by probability
    transcript_to_protein_to_score_sorted_by_score = sorted(transcript_to_protein_to_score, key=lambda x: x[2])

    # Write to file in data/
    with open('data/protein_to_score.txt', 'w') as f:
        # Change this between protein_to_score || transcript_to_score
        count = 1
        f.write("index,transcript,protein,probability\n")
        for triplet in transcript_to_protein_to_score_sorted_by_score:
            f.write("{},{},{},{}\n".format(count, triplet[0], triplet[1], triplet[2]))
            count = count + 1


