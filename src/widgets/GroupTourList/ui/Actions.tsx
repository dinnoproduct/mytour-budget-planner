import { Button, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"
import { Text } from "@ui"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { Icon } from "@ui"
import { useState } from "react"

export enum GroupTourSortType {
    NEWEST = "newest",
    CLOSEST_DATES = "closestDates",
    CHEAPEST = "cheapest"
}

export const Actions = ({
    totalTours,
    sortType,
    onSortChange
}: {
    totalTours: number
    sortType: GroupTourSortType
    onSortChange: (sort: GroupTourSortType) => void
}) => {
    const { t } = useTranslation()

    const [isOpen, setIsOpen] = useState(false)

    return (
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} width="full" flexDirection={{ base: "column", md: "row" }} gap={{ base: 2, md: 0 }}>
            <Text fontSize={{ base: "14px", md: "18px" }} color="gray.700" fontWeight="semibold">
                {t(`groupToursTotalTours`, { total: totalTours })}
            </Text>
            <Menu onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
                <Flex align="center" gap={2}>
                    <Text fontSize={{ base: "14px", md: "18px" }} color="gray.700" fontWeight="semibold">
                        {t('groupToursSort.title')}
                    </Text>
                    <MenuButton
                        as={Button}
                        onClick={() => setIsOpen(!isOpen)}
                        borderRadius="12px"
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        borderColor="blue.700"
                        color="blue.700"
                        bg="white"
                    >
                        {t(`groupToursSort.${sortType}`)}
                        <ChevronDownIcon ml="12px" transform={isOpen ? 'rotate(180deg)' : ''} transition="transform 0.2s ease-in-out" />

                    </MenuButton>
                </Flex>
                <MenuList minW="240px">
                    {
                        Object.values(GroupTourSortType).map((sort) => (
                            <MenuItem key={sort} onClick={() => onSortChange(sort)}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Text fontSize="16px" fontWeight="400" display="inline-block">
                                    {t(`groupToursSort.${sort}`)}
                                </Text>
                                {sortType === sort && <Icon name={'check'} width="20px" height="20px" color="blue.500" />}
                            </MenuItem>
                        ))
                    }
                </MenuList>
            </Menu>
        </Flex >
    )
}