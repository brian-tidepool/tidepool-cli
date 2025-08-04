import * as Utils from './Utils.js';
import * as DateGen from './dateGenerator.js';





export async function cbgPayload(
    startDate: Date,
    endDate: Date,
    incrementMinutes: number,
    cbgValues: number[]
): Promise<any[]> {

    const dateArray = DateGen.generateDateArray2D(startDate, endDate, incrementMinutes);

    const dateArrayString = dateArray.map(row => {
        return row.map((value, index) => value.toISOString())
    })


    const stringArray1D = cbgValues.map(value => { return value.toString() });
    const result = Utils.resizeAndAdd3D(dateArrayString, stringArray1D);

    // result.forEach((day, dayIndex) => {
    //     console.log(`Day ${dayIndex + 1}:`);
    //     day.forEach((date) => {
    //         console.log(date[0], date[1])
    //     });
    //     console.log()
    // });



    const { default: jsonData } = await import('../data/cbg.json', { with: { type: 'json' } });
    //console.log(jsonData.time)
    const payload: any[] = []

    result.forEach((day, dayIndex) => {
        day.forEach((date) => {
            let dataPoint = structuredClone(jsonData);
            dataPoint['time'] = date[0];
            dataPoint['value'] = Number(date[1]);
            payload.push(dataPoint)
        });
    });


    // payload.forEach((day, dayIndex) => {
    //     console.log(`row ${dayIndex + 1}:`);

    //     console.log(day.time, day.value)


    //     console.log()
    // });


    return payload
}



export function duplicateEntries<T>(sourceArray: T[], countsArray: number[]): T[] {
    return sourceArray.flatMap((item, index) =>
        Array(countsArray[index] || 0).fill(item)
    );
}


