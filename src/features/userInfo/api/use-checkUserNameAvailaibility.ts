import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useState, useEffect, useMemo } from 'react'
import debounce from 'lodash/debounce'

export const useCheckUserNameAvailability = (initialUserName = '') => {
    const [debouncedUserName, setDebouncedUserName] = useState(initialUserName)

    const debouncedSetUserName = useMemo(
        () => debounce((value: string) => setDebouncedUserName(value), 300),
        []
    )

    const result = useQuery(api.userInfo.checkUserName, {
        userName: debouncedUserName
    })

    const isLoading = result === undefined
    const isAvailable = result !== null && result === false

    return { 
        isAvailable, 
        isLoading, 
        setUserName: debouncedSetUserName 
    }
}