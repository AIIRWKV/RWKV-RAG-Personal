# coding=utf-8

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer


def text_summary(text):
    """
    生成摘要， TODO 暂时只支持中文
    """

    parser = PlaintextParser.from_string(text, Tokenizer("chinese"))
    summarizer = LexRankSummarizer()

    # 生成摘要（按句子数控制字数）
    se = len(text) // 200
    summary = summarizer(parser.document, sentences_count=se)  # 约200字
    return ''.join([str(sentence) for sentence in summary])
