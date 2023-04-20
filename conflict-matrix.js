const fs = require('fs')
const { parse } = require('csv-parse');

async function getOfferings(inputFilePath) {
    const offerings = [];
    const readStream = fs
        .createReadStream(inputFilePath)
        .pipe(parse({ delimiter: ",", from_line: 2 }));
  
    for await (const row of readStream) {
      offerings.push([row[0],row[1],row[2]]);
    }
    return offerings.sort((a,b) => {
        return (a[2] > b[2]) ? 1 : -1
    })
};

async function createMatrix() {
    const emptyMatrix = new Map;
    const courseRef = {};
    await getOfferings('imports/course-offerings.csv')
        .then(offerings => {
            for (a in offerings) {
                courseA = offerings[a][0]
                // add the course to the course reference object
                if (!courseRef[courseA]) courseRef[courseA] = [offerings[a][1],offerings[a][2]]
                // add the course to the empty matrix
                if (!emptyMatrix.get(courseA)) emptyMatrix.set(courseA, new Map);
                for (b in offerings) {
                    courseB = offerings[b][0]
                    if (!emptyMatrix.get(courseA).get(courseB)) emptyMatrix.get(courseA).set(courseB, 0);
                }
            };
        }
    );
    return [emptyMatrix, courseRef];
};

async function getStudents(inputFilePath, requestsByStudent) {
    const students = [];

    const readStream = fs
        .createReadStream(inputFilePath)
        .pipe(parse({ delimiter: ",", from_line: 2 }));
  
    for await (const row of readStream) {
        if (!requestsByStudent[row[0]]) {
            students.push([row[0],row[1],row[2],row[3]]);
            requestsByStudent[row[0]] = new Set;
        };
        requestsByStudent[row[0]].add(row[7]);
    };
    return students
};

async function fillMatrix(conflictMatrixCourseRef) {
    const conflictMatrix = conflictMatrixCourseRef[0];
    const courseRef = conflictMatrixCourseRef[1];
    const requestsByStudent = {};
    await getStudents('imports/schedule-requests.csv', requestsByStudent)
        .then(students => {
            for (const i in students) {
                const courseList = requestsByStudent[students[i][0]];
                courseList.forEach((courseA) => {
                    courseList.forEach((courseB) => {
                        let count = conflictMatrix.get(courseA).get(courseB) + 1
                        conflictMatrix.get(courseA).set(courseB, count);
                        })
                    })
                }
            }
        );
    return [conflictMatrix, courseRef];
};

function populateCSV(conflictMatrixCourseRef) {
    const conflictMatrix = conflictMatrixCourseRef[0];
    const courseRef = conflictMatrixCourseRef[1];

    let csvText = '';
    let rows = [];

    const iterator = conflictMatrix[Symbol.iterator]();

    const firstElem = iterator.next();
    firstElem.value[1].forEach((value,key) => {
        csvText += `,${courseRef[key][1]}`;
        rows.push(`${courseRef[key][1]},`+(firstElem.value[0] == key ? `${value}` : `${value}`))
    })
    csvText += '\n';

    let currElem = iterator.next();
    while (currElem.value != undefined) {
        let rowNum = 0;
        currElem.value[1].forEach((value, key) => {
            rows[rowNum] += currElem.value[0] == key ? `,${value}` : `,${value}`;
            rowNum += 1;
        })
        currElem = iterator.next();
    }

    for (const row in rows) {
        csvText += `${rows[row]}\n`
    }

    fs.writeFile( 'exports/conflict-matrix.csv', csvText, () => console.log('File Updated') )
}

createMatrix()
    .then(emptyMatrixCourseRef => fillMatrix(emptyMatrixCourseRef))
    .then(conflictMatrixCourseRef => populateCSV(conflictMatrixCourseRef));