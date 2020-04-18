# -*- coding: utf-8 -*-

import re

conversiontable = {
    'ॐ' : 'oṁ',
    'ऀ' : 'ṁ',
    'ँ' : 'a',
    'ं' : 'ṃ',
    'ः' : 'ḥ',
    'अ' : 'a',
    'आ' : 'aa',
    'इ' : 'i',
    'ई' : 'i',
    'उ' : 'u',
    'ऊ' : 'u',
    'ऋ' : 'ru',
    'ॠ' : 'r̥u',
    'ऌ' : 'lu',
    'ॡ' : 'lu',
    'ऍ' : 'e',
    'ऎ' : 'e',
    'ए' : 'e',
    'ऐ' : 'ai',
    'ऑ' : 'ou',
    'ऒ' : 'o',
    'ओ' : 'o',
    'औ' : 'au',
    'ा' : 'a',
    'ि' : 'i',
    'ी' : 'i',
    'ु' : 'u',
    'ू' : 'u',
    'ृ' : 'ru',
    'ॄ' : 'ru',
    'ॢ' : 'lu',
    'ॣ' : ' lu',
    'ॅ' : 'e',
    'े' : 'e',
    'ै' : 'ai',
    'ॉ' : 'o',
    'ो' : 'o',
    'ौ' : 'au',
    'क़' : 'k',
    'क' : 'k',
    'ख़' : 'kh',
    'ख' : 'kh',
    'ग़' : 'g',
    'ग' : 'g',
    'ॻ' : 'g',
    'घ' : 'gh',
    'ङ' : 'nd',
    'च' : 'c',
    'छ' : 'ch',
    'ज़' : 'z',
    'ज' : 'j',
    'ज़' : 'z',
    'ॼ' : 'j',
    'झ' : 'jh',
    'ञ' : 'n',
    'ट' : 't',
    'ठ' : 'th',
    'ड़' : 'd',
    'ड' : 'd',
    'ॸ' : 'd',
    'ॾ' : 'd',
    'ढ़' : 'dh',
    'ढ' : 'dh',
    'ण' : 'n',
    'त' : 't',
    'थ' : 'th',
    'द' : 'd',
    'ध' : 'dh',
    'न' : 'n',
    'प' : 'p',
    'फ़' : 'f',
    'फ' : 'ph',
    'ब' : 'b',
    'ॿ' : 'b',
    'भ' : 'bh',
    'म' : 'm',
    'य' : 'y',
    'र' : 'r',
    'ल' : 'l',
    'ळ' : 'l',
    'व' : 'v',
    'श' : 'sh',
    'ष' : 'sh',
    'स' : 's',
    'ह' : 'h',
    'ऽ' : '\'',
    '्' : '',
    '़' : '',
    '०' : '0',
    '१' : '1',
    '२' : '2',
    '३' : '3',
    '४' : '4',
    '५' : '5',
    '६' : '6',
    '७' : '7',
    '८' : '8',
    '९' : '9',
    'ꣳ' : 'ṁ',
    '।' : '.',
    '॥' : '..',
    ' ' : ' ',
}


consonants = '\u0915-\u0939\u0958-\u095F\u0978-\u097C\u097E-\u097F'
vowelsigns = '\u093E-\u094C\u093A-\u093B\u094E-\u094F\u0955-\u0957'
nukta = '\u093C'
virama = '\u094D'

devanagarichars = '\u0900-\u097F\u1CD0-\u1CFF\uA8E0-\uA8FF'

def deva_to_latn(text):

    word = text.strip()

    # define a buffer to store the transliteration
    curr = ''

    for index, char in enumerate(word):

        # check if char is a Devanagari character. if true then continue processing.
        # otherwise, output char to curr
        if re.match('[' + devanagarichars + ']', char):

            # if char = consonant, then its transliteration is dependent upon various
            # factors. need to check if next char = nukta, virama, vowel sign.

            if re.match('[' + consonants + ']', char):

                # check next char
                nextchar = word[(index + 1) % len(word)]

                if nextchar:

                    # if next char = nukta, then add present char and nukta 
                    # to 'cons'. else just add present char. set variable
                    # to test for nukta when processing next char

                    if re.match('[' + nukta + ']', nextchar):

                        cons = char + nextchar
                        nukta_present = 1
                    else:
                        cons = char
                        nukta_present = 0

                    # if present char is nukta, then check next char

                    if nukta_present:
                        nextchar = word[(index + 2) % len(word)]

                    # if next char = combining sign or virama, convert consonant 
                    # without "a". else if next char != combining sign or virama, 
                    # add "a" to consonant
                        

                    if re.match('[' + vowelsigns + virama +']', nextchar):
                        # print(nextchar)
                        # print(trans)
                        print(cons)
                        trans = conversiontable.get(cons, '')
                        print(trans)
                        # print(cons)
                        # print(trans)
                        curr = curr + trans
                    else:
                        # print(index)
                        print(char)
                        
                        #Added by shubhankar30
                        if index != len(word)-1:
                            trans = conversiontable.get(cons, '')
                            trans = trans + 'a'
                            curr = curr + trans
                        else:
                            trans = conversiontable.get(cons, '')
                            trans = trans
                            curr = curr + trans

            # transliterate all other chars

            else:
                trans = conversiontable.get(char, '')
                curr = curr + trans

        # char is not Devanagari. output char to curr

        else:
             curr = curr + char

    return curr


def getLatin(inputtext):

    word_syllables = []
    all_words = []

    for word in inputtext.split():

        latin_output = deva_to_latn(word)
        all_words.append(latin_output)
        joined_all_words = ' '.join(all_words)

    return joined_all_words

text = "फरमान"

print (getLatin(text))