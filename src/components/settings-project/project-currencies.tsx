import { Box } from "@/ui/box";
import { Card } from "@/ui/card";
import { Select } from '@/ui/select';
import { Button } from "@/ui/button";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { TProject, TCurrencyOption } from "@/types";
import styles from '@/styles/form-project.module.css';
import { useRouter } from "next/navigation";

type TForm = {
    id: string;
    currencies: {code:string, primary:boolean, name: string}[];
}

type TProps = {
    defaultValues: TForm;
    currencies: TCurrencyOption[];
}

function isProject(data: TErrorResponse | {project: TProject}): data is {project: TProject} {
    return (data as {project: TProject}).project.id !== undefined;
}

export function ProjectCurrencies({defaultValues, currencies}: TProps) {
    const { control, handleSubmit, formState, reset, setError } = useForm<TForm>({defaultValues});
        
    const router = useRouter();

    const currenciesFieldArray = useFieldArray({
        name: 'currencies',
        control
    });
    const { fields, append, remove, update } = currenciesFieldArray;

    const [currenciesOptions, setCurrenciesOptions] = useState<TCurrencyOption[]>(currencies);
    const [currencyCode, setCurrencyCode] = useState<string>('');

    useEffect(() => {
        const codes = defaultValues.currencies.map(c => c.code);
        if (codes.length) {
            setCurrenciesOptions(prevState => prevState.filter(c => !codes.includes(c.value)));
        }
    }, []);

    const handleCurrency = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setCurrencyCode(target.value);
    };
    const handlePrimary = (index:number, code:string) => {
        const primaryIndex = fields.findIndex(f => f.primary);
        if (primaryIndex === -1) {
            return;
        }
        update(primaryIndex, {code: fields[primaryIndex].code, primary: false, name: fields[primaryIndex].name});
        update(index, {code, primary: true, name: fields[index].name});
    };
    const handleRemoveCurrency = (index: number) => {
        const code = fields[index].code;
        const currencyIndex = currencies.findIndex(c => c.value === code);
        if (currencyIndex === -1) {
            return;
        }

        currenciesOptions.splice(currencyIndex, 0, {label: currencies[currencyIndex].label, value: currencies[currencyIndex].value});
        setCurrenciesOptions(currenciesOptions);
        remove(index);
    };
    const handleAddCurrency = () => {
        if (!currencyCode) {
            return;
        }

        const c = currencies.find(c => c.value === currencyCode);
        if (!c) {
            return;
        }

        append({code: currencyCode, primary: false, name: c.label});
        setCurrenciesOptions(prevState => prevState.filter(c => c.value !== currencyCode));
        setCurrencyCode('');
    };


    const onSubmit: SubmitHandler<TForm> = async (data) => {
        try {
            const res = await fetch('/internal/api/project', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const dataJson = await res.json();
            if (!isProject(dataJson)) {
                throw new Error('Fetch error');
            }

            reset({id: dataJson.project.id, currencies: dataJson.project.currencies});
            router.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <Box padding={16}>
                    <ul className={styles.currencies}>
                        {fields.map((item, index) => (
                            <li key={item.id}>
                                <div>
                                    <span>{item.name}</span>
                                    <span>{item.primary}</span>
                                </div>
                                {!item.primary && (
                                    <div className={styles.actionCurrency}>
                                        <Button onClick={() => handlePrimary(index, item.code)}>Set Primary</Button>
                                        <Button onClick={() => handleRemoveCurrency(index)}>Delete</Button>
                                    </div>
                                )}
                                {item.primary && <div><span>Primary</span></div>}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <Select 
                            onChange={handleCurrency}
                            options={[{value: '', label: 'Select an option'}, ...currenciesOptions]}
                        />

                        <Button onClick={() => handleAddCurrency()}>Add currency</Button>
                    </div>
                </Box>
            </Card>

            <Button disabled={!formState.isDirty} submit={true} primary>Update</Button>
        </form>
    )
}