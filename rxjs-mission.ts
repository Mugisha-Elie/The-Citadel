import { of, map, tap, catchError, throwError, delay, Observable, filter } from "rxjs";

interface Mission {
  id: number;
  status: string;
  encrypted: boolean;
}

const missionSource$: Observable<Mission> = of({
  id: 99,
  status: 'PENDING',
  encrypted: false,
})

missionSource$.pipe(
  filter(mission => mission.id > 100),
  tap(mission => console.log(`[LOG]: Mission ${mission.id} received.`)),
  map(mission => {
    console.log(`[Process]: Encrypting mission data...`);
    return { ...mission, status: 'ACTIVE', encrypted: true };
  }),
  delay(1000),
  map(mission => {
    throw new Error("Intercepted: Signal Jammed");
    return mission
  }),

  catchError(err => {
    console.error(`[Alert]: ${err.message}`);
    return throwError(() => new Error('Mission Aborted'));
  })
).subscribe({
  next: (mission) => console.log(mission),
  error: (err) => console.log(err.message),
  complete: () => console.log("Done"),
})