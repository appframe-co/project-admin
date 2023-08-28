'use client'

import styles from '@/styles/bricks-editor.module.css'
import { TBrick } from '@/types'
import { ValidationRules } from '@/components/validation-rules'

export function Brick(
    {register, fields, deleteBrick, activeIndexBrick, setLayer}: 
    {register: any, fields: TBrick[], setLayer: (layer: string)=>void, deleteBrick: () => void, activeIndexBrick: number}) 
{
    return (
        <div className={styles.brick}>
            <div>
                <label>Name</label>
                <input {...register(`bricks.${activeIndexBrick}.name`)} />
            </div>
            <div>
                <label>Code</label>
                <input {...register(`bricks.${activeIndexBrick}.code`)} />
            </div>
            <hr />
            <div>
                <p>Validation rules</p>
                <div>
                    {fields[activeIndexBrick].validation.map((v, i) => {
                        return (
                            <div key={i}>
                                <ValidationRules code={v.code} field={`bricks.${activeIndexBrick}.validation.${i}.value`} register={register} />
                            </div>
                        );
                    })}
                </div>
            </div>
            <button type="button" onClick={deleteBrick}>Delete Brick</button>
            <button type="button" onClick={() => setLayer('bricks')}>Back</button>
        </div>
    )
}