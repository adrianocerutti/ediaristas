import { houseParts } from './../../../ui/partials/encontrar-diarista/_detalhes-servico';
import { DateService } from './../../services/DateService';
import { ValidationService } from './../../services/ValidationService';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormSchemaService } from 'data/services/FormSchemaService';
import {
    CadastroClienteFormDataInterface,
    LoginFormDataInterface,
    NovaDiariaFormDataInterface,
    PagamentoFormDataInteface,
} from 'data/@types/FormInterface';
import { ServicoInterface } from 'data/@types/ServicoInterface';
import useApi from '../useApi.hook';
import { DiariaInterface } from './../../@types/DiariaInterface';

export default function useContratacao() {
    const [step, setStep] = useState(1),
        [hasLogin, setHasLogin] = useState(false),
        [loginError, setLoginError] = useState(''),
        breadcrumbItems = ['Detalhes da diária', 'Identificação', 'Pagamento'],
        serviceForm = useForm<NovaDiariaFormDataInterface>({
            resolver: yupResolver(
                FormSchemaService.address().concat(
                    FormSchemaService.detalhesServico()
                )
            ),
        }),
        clientForm = useForm<CadastroClienteFormDataInterface>({
            resolver: yupResolver(
                FormSchemaService.userData().concat(
                    FormSchemaService.newContact()
                )
            ),
        }),
        paymentForm = useForm<PagamentoFormDataInteface>({
            resolver: yupResolver(FormSchemaService.payment()),
        }),
        loginForm = useForm<LoginFormDataInterface>({
            resolver: yupResolver(FormSchemaService.login()),
        }),
        servicos = useApi<ServicoInterface[]>('/api/servicos').data,
        dadosFaxina = serviceForm.watch('faxina'),
        tipoLimpeza = useMemo<ServicoInterface>(() => {
            if (servicos && dadosFaxina?.servico) {
                const selectedService = servicos.find(
                    (servico) => servico.id === dadosFaxina?.servico
                );
                if (selectedService) {
                    return selectedService;
                }
            }
            return {} as ServicoInterface;
        }, [servicos, dadosFaxina]),
        tamanhoCasa = useMemo<string[]>(() => {
            return listarComodos(dadosFaxina);
        }, [tipoLimpeza, dadosFaxina]),
        totalPrice = useMemo<number>(() => {
            return calcularPreco(dadosFaxina, tipoLimpeza);
        }, [tipoLimpeza, dadosFaxina]),
        totalTime = useMemo<number>(() => {
            return calcularTempoServico(dadosFaxina, tipoLimpeza);
        }, [dadosFaxina, tipoLimpeza]);

    useEffect(() => {
        if (
            dadosFaxina &&
            ValidationService.hora(dadosFaxina.hora_inicio) &&
            totalTime >= 0
        ) {
            serviceForm.setValue(
                'faxina.hora_termino',
                DateService.addHours(
                    dadosFaxina?.hora_inicio as string,
                    totalTime
                ),
                { shouldValidate: true }
            );
        } else {
            serviceForm.setValue('faxina.hora_termino', '');
        }
    }, [dadosFaxina?.hora_inicio, totalTime]);

    function onServiceFormSubmit(data: NovaDiariaFormDataInterface) {
        console.log(data);
    }

    function onClientFormSubmit(data: CadastroClienteFormDataInterface) {
        console.log(data);
    }

    function onLoginFormSubmit(data: LoginFormDataInterface) {
        console.log(data);
    }

    function onPaymentFormSubmit(data: PagamentoFormDataInteface) {
        console.log(data);
    }

    function listarComodos(dadosFaxina: DiariaInterface): string[] {
        const comodos: string[] = [];
        if (dadosFaxina) {
            houseParts.forEach((housePart) => {
                const total = dadosFaxina[
                    housePart.name as keyof DiariaInterface
                ] as number;

                if (total > 0) {
                    const nome =
                        total > 1 ? housePart.plural : housePart.singular;
                    comodos.push(`${total} ${nome}`);
                }
            });
        }
        return comodos;
    }

    function calcularTempoServico(
        dadosFaxina: DiariaInterface,
        tipoLimpeza: ServicoInterface
    ) {
        let total = 0;
        if (dadosFaxina && tipoLimpeza) {
            total +=
                tipoLimpeza.horas_banheiro * dadosFaxina.quantidade_banheiros;
            total +=
                tipoLimpeza.horas_cozinha * dadosFaxina.quantidade_cozinhas;
            total += tipoLimpeza.horas_outros * dadosFaxina.quantidade_outros;
            total += tipoLimpeza.horas_quarto * dadosFaxina.quantidade_quartos;
            total +=
                tipoLimpeza.horas_quintal * dadosFaxina.quantidade_quintais;
            total += tipoLimpeza.horas_sala * dadosFaxina.quantidade_salas;
        }
        return total;
    }

    function calcularPreco(
        dadosFaxina: DiariaInterface,
        tipoLimpeza: ServicoInterface
    ) {
        let total = 0;
        if (dadosFaxina && tipoLimpeza) {
            total +=
                tipoLimpeza.valor_banheiro * dadosFaxina.quantidade_banheiros;
            total +=
                tipoLimpeza.valor_cozinha * dadosFaxina.quantidade_cozinhas;
            total += tipoLimpeza.valor_outros * dadosFaxina.quantidade_outros;
            total += tipoLimpeza.valor_quarto * dadosFaxina.quantidade_quartos;
            total +=
                tipoLimpeza.valor_quintal * dadosFaxina.quantidade_quintais;
            total += tipoLimpeza.valor_sala * dadosFaxina.quantidade_salas;
        }
        return Math.max(total, tipoLimpeza.valor_minimo);
    }

    return {
        step,
        setStep,
        breadcrumbItems,
        serviceForm,
        clientForm,
        paymentForm,
        loginForm,
        onServiceFormSubmit,
        onClientFormSubmit,
        onPaymentFormSubmit,
        onLoginFormSubmit,
        servicos,
        hasLogin,
        tipoLimpeza,
        totalPrice,
        tamanhoCasa,
        setHasLogin,
        loginError,
    };
}
