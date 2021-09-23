import useCities from 'data/hooks/useCities.hook';
import { LocationService } from 'data/services/LocationService';
import { useFormContext } from 'react-hook-form';
import { useMemo } from 'react';

export default function useAddressForm() {
    const {
            register,
            control,
            watch,
            formState: { errors },
        } = useFormContext(),
        [addressState, addressCity, addressCep] = watch([
            'endereco.estado',
            'endereco.cidade',
            'endereco.cep',
        ]),
        estados = LocationService.estados(),
        listaCidades = useCities(addressState),
        opcoesCidades = useMemo(
            () => listaCidades.map((item) => item.cidade),
            [listaCidades]
        );
}
