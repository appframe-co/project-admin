import { TEntry, TField } from "@/types";
import { TextField } from "@/ui/text-field";
import { useState } from "react";
import { Control, UseControllerProps } from "react-hook-form";
import styles from '@/styles/fields/content-reference.module.css'
import SearchSVG from "@public/icons/search";
import { Button } from "@/ui/button";

type TAutocomplete = UseControllerProps<any> & {
    onChange: (...event: any[]) => void;
    error?: string;
    label?: string;
    helpText?: string;
    multiline?: boolean;
}
function Autocomplete(props: TAutocomplete) {
    return (
        <div className={styles.search}>
            <span className={styles.icon}><SearchSVG /></span>
            <TextField 
                onChange={props.onChange}
                error={props.error}
                label={props.label}
            />
        </div>
    )
}

type TProp = {
    register: any;
    error: any;
    setValue: any;
    field: TField;
    control: Control;
    name?: string;
    prefixName?: string;
    entryList?: TEntry[];
    value: string;
}

function isError(data: TErrorResponse | any): data is TErrorResponse {
    return (data as TErrorResponse).error !== undefined;
}

export function ContentReference({register, error, setValue, field, entryList=[], value=''}: TProp) {
    const [entries, setEntries] = useState<TEntry[]>([]);
    const [selectedEntries, setSelectedEntries] = useState<TEntry[]>(entryList.filter(e => value === e.id));

    const queue: NodeJS.Timeout[] = [];
    const paramEntryFieldKey = field.params.find(p => p.code === 'entry_field_key');

    async function getEntriesByQuery(q: string) {
        try {
            const param = field.params.find(p => p.code === 'content_id');
            if (!param?.value) {
                throw new Error('Fetch error');
            }

            const res = await fetch(`/admin/internal/api/entries?contentId=${param?.value}&searchFieldKey=${paramEntryFieldKey?.value}&searchFieldValue=${q}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson = await res.json();
            if (isError(dataJson)) {
                throw new Error('Fetch error');
            }

            return dataJson;
        } catch (e) {
            console.log(e);
        }
    }

    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            queue.forEach(element => clearTimeout(element));

            const timeoutId = setTimeout(async () => {
                let q = (event.target as HTMLInputElement).value;
                q = q.trim().toLowerCase();

                if (q === '') {
                    setEntries([]);
                    return;
                }
                if (q.length < 2) {
                    return;
                }
                if (q.length > 25) {
                    return;
                }

               const {entries}: {entries: TEntry[]} = await getEntriesByQuery(q);
               const entriesWOSelected = entries.filter(e => value !== e.id);

               setEntries(entriesWOSelected);
            }, 1000);

            queue.push(timeoutId);
        } catch(e) {
            return;
        }
    };

    const selectEntry = (entryId: string): void => {
        const entry = entries.find(e => entryId === e.id);
        if (!entry) {
            return;
        }

        setValue(entryId);
        setSelectedEntries([entry]);
        setEntries(prevState => prevState.filter(e => entryId !== e.id));
    };

    const removeEntry = (): void => {
        setValue('');
        setSelectedEntries([]);
    };

    if (!paramEntryFieldKey) {
        return <span>Error field [{field.name}]</span>;
    }

    return (
        <>
            <input style={{display: 'none'}} {...register} />

            <Autocomplete name='' onChange={handleChangeSearch} error={error} label={field.name} />

            {!!entries.length && (
                <div className={styles.entries}>
                    {entries.map(entry => (
                        <div key={entry.id} className={styles.entry}>
                            <div>{entry.doc[paramEntryFieldKey?.value]}</div>
                            <div><Button onClick={() => selectEntry(entry.id)}>Select</Button></div>
                        </div>
                    ))}
                </div>
            )}

            {!!selectedEntries.length && (
                <div className={styles.entries}>
                    {selectedEntries.map(entry => (
                        <div key={entry.id} className={styles.entry}>
                            <div>{entry.doc[paramEntryFieldKey?.value]}</div>
                            <div><Button onClick={() => removeEntry()}>Remove</Button></div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}