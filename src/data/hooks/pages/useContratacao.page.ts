import { FormSchemaService } from 'data/services/FormSchemaService';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { NovaDiariaFormDataInterface } from 'data/@types/FormInterface';

export default function useContratacao() {
    const [step, setStep] = useState(1),
        breadcrumbItems = ['Detalhes da diária', 'Identificação', 'Pagamento'],
        serviceForm = useForm<NovaDiariaFormDataInterface>({
            resolver: yupResolver(
                FormSchemaService.address().concat(
                    FormSchemaService.detalhesServico()
                )
            ),
        });

    return {
        step,
        breadcrumbItems,
    };
}
