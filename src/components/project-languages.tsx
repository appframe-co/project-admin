import { Box } from "@/ui/box";
import { Card } from "@/ui/card";
import { Select } from '@/ui/select';
import { Button } from "@/ui/button";
import { useEffect, useState } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { FormValuesEditProject, TProject, TLanguageOption } from "@/types";
import styles from '@/styles/form-project.module.css';

type TProps = {
    project: TProject;
    languagesFieldArray: UseFieldArrayReturn<FormValuesEditProject, 'languages', 'id'>;
    languages: TLanguageOption[];
}

export function ProjectLanguages({project, languagesFieldArray, languages}:TProps) {
    const { fields, append, remove, update } = languagesFieldArray;

    const [languagesOptions, setLanguagesOptions] = useState<TLanguageOption[]>(languages);
    const [languageCode, setLanguageCode] = useState<string>('');

    useEffect(() => {
        const codes = project.languages.map(c => c.code);
        if (codes.length) {
            setLanguagesOptions(prevState => prevState.filter(c => !codes.includes(c.value)));
        }
    }, []);

    const handleLanguage = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setLanguageCode(target.value);
    };
    const handlePrimary = (index:number, code:string) => {
        const primaryIndex = fields.findIndex(f => f.primary);
        if (primaryIndex === -1) {
            return;
        }
        update(primaryIndex, {code: fields[primaryIndex].code, primary: false, name: fields[primaryIndex].name});
        update(index, {code, primary: true, name: fields[index].name});
    };
    const handleRemoveLanguage = (index: number) => {
        const code = fields[index].code;
        const languageIndex = languages.findIndex(c => c.value === code);
        if (languageIndex === -1) {
            return;
        }
        setLanguagesOptions(prevState => {
            prevState.splice(languageIndex, 0, {label: languages[languageIndex].label, value: languages[languageIndex].value});
            return [...prevState];
        });
        remove(index);
    };
    const handleAddLanguage = () => {
        if (!languageCode) {
            return;
        }

        const l = languages.find(l => l.value === languageCode);
        if (!l) {
            return;
        }

        append({code: languageCode, primary: false, name: l.label});
        setLanguagesOptions(prevState => prevState.filter(c => c.value !== languageCode));
        setLanguageCode('');
    };

    return (
        <Card title='Languages'>
            <Box padding={16}>
                <ul className={styles.languages}>
                    {fields.map((item, index) => (
                        <li key={item.id}>
                            <div>
                                <span>{item.name}</span>
                                <span>{item.primary}</span>
                            </div>
                            {!item.primary && (
                                <div className={styles.actionLanguage}>
                                    <Button onClick={() => handlePrimary(index, item.code)}>Set Primary</Button>
                                    <Button onClick={() => handleRemoveLanguage(index)}>Delete</Button>
                                </div>
                            )}
                            {item.primary && <div><span>Primary</span></div>}
                        </li>
                    ))}
                </ul>
                <div>
                    <Select 
                        onChange={handleLanguage}
                        options={[{value: '', label: 'Select an option'}, ...languagesOptions]}
                    />

                    <Button onClick={() => handleAddLanguage()}>Add language</Button>
                </div>
            </Box>
        </Card>
    )
}