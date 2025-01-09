'use client'

import styles from '@/styles/content.module.css'
import { createPortal } from 'react-dom';
import { useCallback, useState } from 'react';
import { Modal } from '@/ui/modal';
import { TSection } from '@/types';
import { Button } from '@/ui/button';

type TParentSection = {
    id: string;
    parentId: string;
    name: string;
}

type TProps = {
    contentId: string;
    sections: TSection[];
    id: string;
    _sectionIds: string[];
    children?: React.ReactNode
}

export function LinkEntrySection({children, contentId, sections, id, _sectionIds}: TProps) {
    const [parentSections, setParentSections] = useState<TParentSection[]>([]);
    const [sectionList, setSectionList] = useState<TSection[]>(sections);
    const [sectionIds, setSectionIds] = useState<string[]>(_sectionIds);
    const [activeModalSections, setActiveModalSections] = useState<boolean>(false);
    const handleChangeModalSections = useCallback(() => setActiveModalSections(!activeModalSections), [activeModalSections]);
    const handleCloseSections = () => handleChangeModalSections();

    const handleSave = async () => {
        try {
            const res = await fetch('/admin/internal/api/entries', {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({sectionIds, id, contentId})
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            await res.json();
        } catch (e) {
            console.log(e);
        }

        handleCloseSections();
    }
    const handleToggleSection = (sectionId:string) => {
        setSectionIds((prevState:string[]) => {
            if (!prevState.includes(sectionId)) {
                return [...prevState, sectionId];
            }

            return prevState.filter(id => id !== sectionId);
        });
    };
    const handleViewSection = async (sectionId: string|null, step?: string) => {
        try {
            let url = `/admin/internal/api/sections?contentId=${contentId}`;
            if (sectionId) {
                url += `&parentId=${sectionId}`
            }

            const res = await fetch(url, {
                method: 'GET',  
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                throw new Error('Fetch error');
            }
            const {sections}: {sections: TSection[] } = await res.json();

            if (!step) {
                const section = sectionList.find(s => s.id === sectionId);
                if (section) {
                    setParentSections(prevState => {
                        const isSection = prevState.some(s => s.id === sectionId);
                        if (!isSection) {
                            return [...prevState, {
                                id: section.id,
                                parentId: section.parentId,
                                name: section.doc.name
                            }];
                        }

                        return [...prevState];
                    });
                }
            } else if (step === 'prev') {
                const psIndex = parentSections.findIndex(s => s.parentId === sectionId);
                setParentSections(prevState => prevState.filter((ps, i) => i < psIndex));
            }

            setSectionList(sections);
        } catch (e) {
            console.log(e);
        }
    };

    const activator = (
        <div onClick={() => handleChangeModalSections()}>
            {children}
        </div>
    );

    return (
        <>
            {activeModalSections && createPortal(
                    <Modal
                        open={activeModalSections}
                        onClose={handleCloseSections}
                        title='Link an entry to sections'
                        primaryAction={{content: 'save', onAction: handleSave}}
                        secondaryActions={[{content: 'cancel', onAction: handleCloseSections}]}
                    >
                        <div className={styles.wrapper}>
                            <div className={styles.container}>
                                <div>
                                    {parentSections.length > 0 && (
                                        <div className={styles.breadcrumbsLinks}>
                                            <div><span onClick={() => handleViewSection(null, 'prev')}>Root sections</span></div>
                                            {parentSections.map(ps => (
                                                <div key={ps.id}>
                                                    <span onClick={() => handleViewSection(ps.parentId, 'prev')}> / {ps.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <ul className={styles.linkSectionList}>
                                    {sectionList.map(section => (
                                        <li key={section.id} className={styles.linkSection}>
                                            <div>
                                                <span onClick={() => handleViewSection(section.id)} className={styles.linkSectionAction}>{section.doc.name}</span>
                                            </div>
                                            <div>
                                                <Button onClick={() => handleToggleSection(section.id)}>
                                                    {!sectionIds.includes(section.id) ? <span>Select</span> : <span>Deselect</span>}
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Modal>,
                document.body
            )}

            {activator}
        </>
    )
}