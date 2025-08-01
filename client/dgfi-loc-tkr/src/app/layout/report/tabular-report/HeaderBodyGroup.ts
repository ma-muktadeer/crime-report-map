export interface HeaderBodyGroup {
    title: string;
    header: { [key: string]: string }[];
    tabularData: Array<{ [key: string]: any }>;
}

export interface FormatedTable {
    title: string;
    header: { [key: string]: string }[];
    body: { [key: string]: any; }[];
}