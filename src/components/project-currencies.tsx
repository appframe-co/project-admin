import { Box } from "@/ui/box";
import { Card } from "@/ui/card";
import { Select } from '@/ui/select';
import { Button } from "@/ui/button";
import { useEffect, useState } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { FormValuesEditProject, TProject, TCurrencyOption } from "@/types";
import styles from '@/styles/form-project.module.css';

export function ProjectCurrencies({project, currenciesFieldArray, currencies}:{project:TProject, currenciesFieldArray: UseFieldArrayReturn<FormValuesEditProject>, currencies: TCurrencyOption[]}) {
    const { fields, append, remove, update } = currenciesFieldArray;

    const [currenciesOptions, setCurrenciesOptions] = useState<TCurrencyOption[]>(currencies);
    const [currencyCode, setCurrencyCode] = useState<string>('');

    useEffect(() => {
        const codes = project.currencies.map(c => c.code);
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
        update(primaryIndex, {code: fields[primaryIndex].code, primary: false});
        update(index, {code, primary: true});
    };
    const handleRemoveCurrency = (index: number) => {
        const code = fields[index].code;
        const currencyIndex = currencies.findIndex(c => c.value === code);
        if (currencyIndex === -1) {
            return;
        }
        setCurrenciesOptions(prevState => {
            prevState.splice(currencyIndex, 0, {label: currencies[currencyIndex].label, value: currencies[currencyIndex].value});
            return [...prevState];
        });
        remove(index);
    };
    const handleAddCurrency = () => {
        append({code: currencyCode, primary: false});
        setCurrenciesOptions(prevState => prevState.filter(c => c.value !== currencyCode));
    };

    return (
        <Card title='Currencies'>
            <Box padding={16}>
                <ul className={styles.currencies}>
                    {fields.map((item, index) => (
                        <li key={item.id}>
                            <div>
                                <span>{item.code}</span>
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
    )
}