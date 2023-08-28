import { UseFormRegister } from 'react-hook-form'
import { FormValuesManageBricks } from '@/types'

export function ValidationRules({code, field, register}: {code: string, field: any, register: UseFormRegister<FormValuesManageBricks>}) {
    return (
        <div>
            {code === 'required' && (
                <div>
                    <input type='checkbox' {...register(field, {})} />
                    <label>Required</label>
                </div>
            )}
            {code === 'max' && (
                <div>
                    <label>Max</label>
                    <input type='number' {...register(field, {valueAsNumber: true})} />
                </div>
            )}
            {code === 'min' && (
                <div>
                    <label>Min</label>
                    <input type='number' {...register(field, {valueAsNumber: true})} />
                </div>
            )}
            {code === 'maxLength' && (
                <div>
                    <label>Max length</label>
                    <input type='number' {...register(field, {valueAsNumber: true})} />
                </div>
            )}
        </div>
    )
}