import { Box, Button, Card, CardBody, CardHeader, FormControl, FormLabel, GridItem, Heading, Input, Select, SimpleGrid, Table, Td, Tr, Thead, useToast, VStack, Tbody, Th, Container } from "@chakra-ui/react"
import { FormEvent, useState } from "react"
import { ganttChartInfoType, solve, solvedProcessesInfoType } from "./algorithms";
import GanttChart from "./GanttChart";

type Algos =
  "FCFS"
  | "SJF"
  | "SRTF"
  | "RR"
  | "PNP"
  | "PP";

const precisionRound = (number: number, precision: number) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

function App() {
  const toast = useToast();
  const [algo, setAlgo] = useState<Algos>("FCFS");
  const [solvedChart, setSolvedChart] = useState<solvedProcessesInfoType>([]);
  const [ganttChart, setGanttChart] = useState<ganttChartInfoType>([]);


  const submit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: {
      arrivalTimes: number[],
      burstTimes: number[],
      timeQuantum: number,
      priorities: number[]
    } = {
      arrivalTimes: (formData.get("arrival-times") as string).split(" ").map(val => +val),
      burstTimes: (formData.get("burst-times") as string).split(" ").map(val => +val),
      timeQuantum: (formData.get("time-quantum") || 0) as number,
      priorities: (formData.get("priorities") as string || "").split(" ").map(val => +val),
    };
    try {
      const results = solve(algo, data.arrivalTimes, data.burstTimes, data.timeQuantum, data.priorities);
      setSolvedChart(results.solvedProcessesInfo);
      setGanttChart(results.ganttChartInfo);
    } catch (err) {
      console.error(err);
      toast({
        status: "error",
        title: "Unexpected Error Occurred",
        description: "Verify your entries and try again."
      })
    }
  }

  const total = (array: number[]) =>
    array.reduce((acc, currentValue) => acc + currentValue, 0);

  const numberOfProcesses = solvedChart.length;
  const turnaoundTime = solvedChart.map((process) => process.tat);
  const waitingTime = solvedChart.map((process) => process.wat);

  const totalTAT = total(turnaoundTime);
  const averageTAT = totalTAT / numberOfProcesses;

  const totalWAT = total(waitingTime);
  const averageWAT = totalWAT / numberOfProcesses;

  return <SimpleGrid
    as={Container}
    maxW="1700px"
    pt={20}
    columns={4}
    gap={5}>
    <Card boxShadow={"md"}>
      <CardHeader>
        <Heading size="lg">Input</Heading>
      </CardHeader>
      <CardBody>
        <VStack gap={3}>
          <FormControl>
            <FormLabel>Algorithm</FormLabel>
            <Select value={algo} onChange={e => setAlgo(e.target.value as Algos)}>
              <option value="FCFS">First Come First Serve, FCFS</option>
              <option value="SJF">Shortest Job First, SJF (non-preemptive)</option>
              <option value="SRTF">Shortest Remaining Time First, SRTF</option>
              <option value="RR">Round Robin, RR</option>
              <option value="PNP">Priority (non-preemptive)</option>
              <option value="PP">Priority (preemptive)</option>
            </Select>
          </FormControl>
          <Box w="100%">
            <form onSubmit={submit}>
              <VStack gap={3}>
                <FormControl>
                  <FormLabel>Arrival Times</FormLabel>
                  <Input name="arrival-times" placeholder="e.g. 0 2 4 6 8" />
                </FormControl>
                <FormControl>
                  <FormLabel>Burst Times</FormLabel>
                  <Input name="burst-times" placeholder="e.g. 2 4 6 8 10" />
                </FormControl>
                {algo === "RR" ? <FormControl>
                  <FormLabel>Time Quantum</FormLabel>
                  <Input name="time-quantum" placeholder="e.g. 3" />
                </FormControl> :
                  ["PNP", "PP"].includes(algo) ? <FormControl>
                    <FormLabel>Priorities</FormLabel>
                    <Input name="priorities" placeholder="Lower# = higher priority" />
                  </FormControl> : null}
                <Button mr="auto" colorScheme="orange" type="submit">Solve</Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </CardBody>
    </Card>
    <Card boxShadow={"md"} as={GridItem} colSpan={3}>
      <CardHeader>
        <Heading size="lg">Output</Heading>
      </CardHeader>
      <CardBody>
        <GanttChart ganttChartInfo={ganttChart} />
        <Table mt={5} variant="striped">
          <Thead>
            <Tr>
              <Th>Job</Th>
              <Th>Arrival Time</Th>
              <Th>Burst Time</Th>
              <Th>Finish Time</Th>
              <Th>Turnaround Time</Th>
              <Th>Waiting Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {solvedChart.map(process => (
              <Tr key={`process-row-${process.job}`}>
                <Td>{process.job}</Td>
                <Td>{process.at}</Td>
                <Td>{process.bt}</Td>
                <Td>{process.ft}</Td>
                <Td>{process.tat}</Td>
                <Td>{process.wat}</Td>
              </Tr>
            ))}
            {<Tr>
              <Td colSpan={4} style={{ textAlign: 'right' }}>
                Average
              </Td>
              <Td>
                {totalTAT} / {numberOfProcesses} = {precisionRound(averageTAT, 3)}
              </Td>
              <Td>
                {totalWAT} / {numberOfProcesses} = {precisionRound(averageWAT, 3)}
              </Td>
            </Tr>}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  </SimpleGrid>
}

export default App
export type { Algos }