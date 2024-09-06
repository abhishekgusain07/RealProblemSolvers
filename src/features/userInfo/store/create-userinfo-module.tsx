import {atom, useAtom} from 'jotai'

const modalAtom = atom(false);

export const useCreateUserInfoModal = () => {
    return useAtom(modalAtom);
}