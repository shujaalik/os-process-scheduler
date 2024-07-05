import { Algos } from "../App";
import { fcfs } from "./fcfs";
import { pnp } from "./pnp";
import { pp } from "./pp";
import { rr } from "./rr";
import { sjf } from "./sjf";
import { srtf } from "./srtf";

export type ganttChartInfoType = {
    job: string;
    start: number;
    stop: number;
}[];

export type solvedProcessesInfoType = {
    job: string;
    at: number;
    bt: number;
    ft: number;
    tat: number;
    wat: number;
}[];

export const solve = (
    algo: Algos,
    arrivalTime: number[],
    burstTime: number[],
    timeQuantum: number,
    priorities: number[]
) => {
    switch (algo) {
        case 'FCFS':
            return fcfs(arrivalTime, burstTime);
        case 'SJF':
            return sjf(arrivalTime, burstTime);
        case 'SRTF':
            return srtf(arrivalTime, burstTime);
        case 'RR':
            return rr(arrivalTime, burstTime, timeQuantum);
        case 'PNP':
            return pnp(arrivalTime, burstTime, priorities);
        case 'PP':
            return pp(arrivalTime, burstTime, priorities);
    }
};