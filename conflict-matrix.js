const fs = require('fs')
const { parse } = require('csv-parse');

async function getOfferings(inputFilePath) {
    const offerings = [];
    const readStream = fs
        .createReadStream(inputFilePath)
        .pipe(parse({ delimiter: ",", from_line: 2 }));
  
    for await (const row of readStream) {
      offerings.push(row[2]);
    }

    return offerings
};

async function createEmptyMatrix() {
    const conflictMatrix = {};
    await getOfferings('imports/course-offerings.csv')
        .then(offerings => {
            for (a in offerings) {
                courseA = offerings[a]
                if (!conflictMatrix[courseA]) conflictMatrix[courseA] = {};
                for (b in offerings) {
                    courseB = offerings[b]
                    if (!conflictMatrix[courseA][courseB]) conflictMatrix[courseA][courseB] = 0;
                }
            };
        }
    );

    return conflictMatrix;
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
        requestsByStudent[row[0]].add(row[9]);
    }

    return students
};

async function fillMatrix(conflictMatrix) {
    const requestsByStudent = {};
    await getStudents('imports/schedule-requests.csv', requestsByStudent)
        .then(students => {
            for (const i in students) {
                const courseList = requestsByStudent[students[i][0]];
                courseList.forEach((courseA) => {
                    courseList.forEach((courseB) => {
                        conflictMatrix[courseA][courseB] = conflictMatrix[courseA][courseB] + 1;
                        })
                    })
                }
            }
        );
    console.log('conflictMatrix ',conflictMatrix)
};

createEmptyMatrix().then(data => fillMatrix(data))