export interface Comparator<T> {
    compare: (o1: T, o2: T) => number;
}