# Ejercicio 6

# Funcion principal
def sort_string(string):
    word = ''
    list_words = []

    for char in string:
        if char == '-':
            list_words.append(word)
            word = ''
        else:
            word += char  

    list_words.append(word)  
    list_words.sort()
    
    result = ''

    for word in range(len(list_words)):
        result += list_words[word]

        if word != len(list_words) - 1:
            result += '-'
        
    return result

my_string = input('Escriba una cadena de palabras separadas por guiones: ')
result = sort_string(my_string)
print(result)
