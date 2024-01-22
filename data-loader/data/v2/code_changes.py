import csv

def compare_csv_files(file1, file2):
    changes1 = []
    changes2 = []
    
    with open(file1, 'r') as f1, open(file2, 'r') as f2:
        reader1 = csv.reader(f1)
        reader2 = csv.reader(f2)
        
        for r_index, (row1, row2) in enumerate(zip(reader1, reader2)):
            for index, (value1, value2) in enumerate(zip(row1, row2)):
                if value1.strip() != value2.strip():
                    if index >=13 and index <= 23:
                        print("CODE CHANGE:",r_index, ':', row1[0], index, '[', value1, "] vs [", value2, ']')
                    else:
                        print("OTHER:",r_index, ':', row1[0], index, '[', value1, "] vs [", value2, ']')
                    changes1.append(row1)
                    changes2.append(row2)
                    break
    
    return changes1, changes2

# Usage example
file1 = 'products_sorted.csv'
file2 = 'UC4.9.csv'

out1 = 'products_diff.csv'
out2 = 'UC4.9_diff.csv'
(changes1,changes2) = compare_csv_files(file1, file2)

# csv.writer(open(out1, 'w')).writerows(changes1)
# csv.writer(open(out2, 'w')).writerows(changes2)
