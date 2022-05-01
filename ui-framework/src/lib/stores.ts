export type Unsubscribe = () => void
export type Subscription<T> = (newval: T) => void

interface BaseStore<T> {
    id: number
    type: string
    subscribe(listener: Subscription<T>): Unsubscribe
}

export interface Readable<T> extends BaseStore<T> {
    type: "readable"
}

export interface Writable<T> extends BaseStore<T> {
    type: "writable"
    set(val: T): void
}

export interface Derived<T> extends BaseStore<T> {
    type: "derived"
}

export interface Static<T> extends BaseStore<T> {
    type: "static"
}

export type Store<T> = Readable<T> | Writable<T> | Derived<T> | Static<T>

type Stores = [BaseStore<any>, ...Array<BaseStore<any>>] | Array<BaseStore<any>>

type StoresValues<T extends Stores> = {
    [P in keyof T]: T[P] extends BaseStore<infer U> ? U : never
}


// the event emitter for all stores
const event = new EventTarget()
let storeID = 0

export const writable = <T>(init: T): Writable<T> => {
    let value = init

    const id = storeID++

    const eventKey = `change-${id}`

    return {
        id,
        type: 'writable',
        set: (newval: T) => {
            value = newval

            event.dispatchEvent(new CustomEvent(eventKey))
        },
        subscribe: (cb) => {

            // call the handler initially once
            cb(value)

            const handler = () => {
                cb(value)
            }

            event.addEventListener("change", handler)

            return () => {
                event.removeEventListener("change", handler)
            }
        }
    }
}

export const derived = <T, S extends Stores>(stores: S, deriveFN: (values: StoresValues<S>) => T): Readable<T> => {
    const values: StoresValues<S> = [] as unknown as StoresValues<S>

    const id = storeID++

    const eventKey = `change-${id}`

    let init = true

    const unsubscribers = stores.map((store, i) => store.subscribe((newval) => {
        values[i] = newval
        if (!init) {
            event.dispatchEvent(new CustomEvent(eventKey))
        }
    }))

    init = false

    return {
        id,
        type: 'readable',
        subscribe: (cb) => {

            // call the handler initially once
            cb(deriveFN(values))

            const handler = () => {
                cb(deriveFN(values))
            }

            event.addEventListener(eventKey, handler)

            return () => {
                event.removeEventListener(eventKey, handler)

                unsubscribers.forEach((unsub) => unsub())
            }
        }
    }
}

export const staticStore = <T>(val: T): Static<T> => {
    return {
        id: storeID++,
        type: 'static',
        subscribe: (cb) => {
            cb(val)
            return () => { }
        }
    }
}


export const traverseStores = <S extends Stores>(stores: S) => {
    return derived(stores, v => v)
}
