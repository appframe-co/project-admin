'use client'

import { TProject, TCurrencyOption, TLanguageOption, TFile } from '@/types'
import { useState } from 'react';

import styles from '@/styles/form-project.module.css'
import { ProjectCommon } from '../settings-project/project-common';
import { ProjectApi } from '../settings-project/project-api';
import { ProjectCurrencies } from '../settings-project/project-currencies';
import { ProjectLanguages } from '../settings-project/project-languages';
import { ProjectFront } from '../settings-project/project-front';

type TProps = {
    project: TProject;
    files: TFile[];
    accessToken: string; 
    currencies: TCurrencyOption[];
    languages: TLanguageOption[];
}

export function FormEditProject({project, files, accessToken, currencies, languages} : TProps) {
    const [link, setLink] = useState<string>('common');

    return (
        <>
            <div className={styles.links}>
                <ul>
                    <li className={link === 'common' ? styles.active : ''} onClick={() => setLink('common')}>Common</li>
                    <li className={link === 'front' ? styles.active : ''} onClick={() => setLink('front')}>Front</li>
                    <li className={link === 'projectApi' ? styles.active : ''} onClick={() => setLink('projectApi')}>Project API</li>
                    <li className={link === 'currencies' ? styles.active : ''} onClick={() => setLink('currencies')}>Currencies</li>
                    <li className={link === 'languages' ? styles.active : ''} onClick={() => setLink('languages')}>Languages</li>
                </ul>
            </div>

            <div>
                {link === 'common' && <ProjectCommon defaultValues={{id: project.id, name: project.name}} projectNumber={project.projectNumber} />}
                {link === 'front' && <ProjectFront defaultValues={{id: project.id, front: project.front}} files={files} />}
                {link === 'projectApi' && <ProjectApi accessToken={accessToken} />}
                {link === 'currencies' && <ProjectCurrencies defaultValues={{id: project.id, currencies: project.currencies}} currencies={currencies} />}
                {link === 'languages' && <ProjectLanguages defaultValues={{id: project.id, languages: project.languages}} languages={languages} />}
            </div>
        </>
    )
}