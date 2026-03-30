import { Box, Flex, Image, Tag, type LinkProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { type ReactNode, useMemo } from "react";
import { CURRENCY_MAP, LANGUAGE_PREFIX } from "@shared/model";
import { type Language } from "@widgets/Header/model";
import { Icon, Text, Tooltip } from "@ui";
import { LanguageLink } from "@/components/LanguageLink/LanguageLink";
import {
  type DictionaryTypes,
  GroupTourDeparture,
  type GroupTourEntity,
  useDictionary,
} from "@entities/package";
import { formatNumber } from "@shared/utils";
import moment from "moment";
import { getValidDepartures } from "@/widgets/GroupTourDetails/lib/utils";

type GroupTourCardProps = {
  groupTour: GroupTourEntity;
  link?: string;
} & LinkProps;

export const GroupTourCard = ({ groupTour, link = "#", ...props }: GroupTourCardProps) => {
  const { i18n, t } = useTranslation();
  const { data: roomTypes = [] } = useDictionary(
    "RoomTypeDictionary" as DictionaryTypes.RoomTypeDictionary,
  );

  const languageSuffix = useMemo(
    () =>
      (LANGUAGE_PREFIX[i18n.language as Language["name"]] ?? "Eng").toLowerCase(),
    [i18n.language],
  );

  const groupName = useMemo(
    () =>
      groupTour.name[languageSuffix as keyof typeof groupTour.name] ||
      groupTour.name.eng,
    [groupTour.name, languageSuffix],
  );

  const images = useMemo(
    () =>
      groupTour.gallery
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          url: item.url,
          size: 3,
        })),
    [groupTour.gallery],
  );

  const firstDeparture = useMemo(
    () => {
      const valid = getValidDepartures(groupTour.departures);
      if (valid.length > 0) return valid[0];

      return (
        groupTour.departures
          .filter((dep) => dep.availableSeats > 0)
          .sort(
            (a, b) =>
              moment(a.startDate).valueOf() - moment(b.startDate).valueOf(),
          )[0] || groupTour.departures[0]
      );
    },
    [groupTour.departures],
  );

  const validDepartures = useMemo(
    () => getValidDepartures(groupTour.departures),
    [groupTour.departures],
  );

  const fromDate = firstDeparture?.startDate
    ? moment(firstDeparture.startDate)
    : null;
  const toDate = firstDeparture?.endDate
    ? moment(firstDeparture.endDate)
    : null;

  const formatDate = (date: moment.Moment) => {
    const longMonthName = date.locale("en").format("MMMM").toLowerCase();
    const shortMonthName = t(`${longMonthName}Short`);
    return `${shortMonthName} ${date.format("D")}`;
  };

  const roomTypeLabel = useMemo(
    () =>
      roomTypes.find((rt) => rt.key === groupTour.roomType)?.value ?? "",
    [roomTypes, groupTour.roomType],
  );

  const currencyLabel =
    CURRENCY_MAP[groupTour.currency as keyof typeof CURRENCY_MAP] ||
    groupTour.currency;

  const groupTourDeparturesTooltipText = useMemo(() => {
    const departuresToShow = validDepartures.length > 0 ? validDepartures : groupTour.departures

    return (
      <Box>
        <Text color="white" fontWeight="400" fontSize="sm">
          {t('groupTourDeparturesTooltipText')}
        </Text>
        {departuresToShow.map(
          (dep: GroupTourDeparture, index: number) =>
            index !== 0 && (
              <Text
                color="white"
                fontWeight="400"
                fontSize="sm"
                key={`${dep.startDate}-${dep.endDate}-${index}`}
              >
                {formatDate(moment(dep.startDate))} - {formatDate(moment(dep.endDate))}
              </Text>
            ),
        )}
      </Box>
    )
  }, [validDepartures, groupTour.departures, t]);

  return (
    <Layout link={link} {...props}>
      <Box p={3} pb={4} bg={'gray.50'} display="flex" flexDirection="column" height="100%">
        {images.length > 0 && images[0].url !== "" && images[0].url !== null ? (
          <Image
            src={images[0].url}
            maxWidth="full"
            height={170}
            width="full"
            objectFit="cover"
            rounded="lg"
          />
        ) : (
          <Box
            width="full"
            height="170px"
            bg="gray.200"
            rounded={'lg'}
            display="flex"
            alignItems="center"
            justifyContent="center"
          />
        )}

        <Box pt="4">
          <Text
            color="gray.800"
            size="md"
            fontWeight="bold"
            noOfLines={1}
            as="h3"
            mb={2}
          >
            {groupName}
          </Text>
          {groupTour?.routeCities?.length > 0 || groupTour?.routeCountries?.length > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <Icon name="location-pin" size="16" color="gray.500" />
              <Text
                size="xs"
                color="gray.600"
                fontWeight="medium"
                noOfLines={1}
              >
                {groupTour?.routeCities?.map((city) => city[languageSuffix as keyof typeof city] || city.eng).join(", ") || groupTour?.routeCountries?.map((c) => c[languageSuffix as keyof typeof c] || c.eng).join(", ")}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
      <Box px={3} py={4}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="nowrap"
          gap={3}
        >
          {roomTypeLabel && (
            <Text
              size="xs"
              color="gray.600"
              fontWeight="normal"
              flex="1 1 auto"
              minW={0}
              noOfLines={1}
            >
              {roomTypeLabel}
            </Text>
          )}
          {fromDate && toDate && (
            <Tag
              variant="subtle-success"
              px={3}
              rounded="full"
              flexShrink={0}
              whiteSpace="nowrap"
              alignItems="center"
              gap={2}
            >
              {formatDate(fromDate)} - {formatDate(toDate)} {validDepartures.length > 1 &&
                <Tooltip
                  label={groupTourDeparturesTooltipText}
                  hasArrow
                  shouldWrapChildren
                >
                  <Flex
                    justify="center"
                    align="center"
                    borderRadius="full"
                    cursor="pointer"
                    tabIndex={0}
                    role="button"
                    onClick={e => {
                      // Prevent navigation because the whole card is wrapped in a link.
                      e.preventDefault()
                      e.stopPropagation()
                        ; (e.currentTarget as HTMLElement).focus()
                    }}
                    onTouchStart={e => {
                      e.stopPropagation()
                    }}
                  >
                    <Icon name="info-outline" size="16" color={'green.500'} />
                  </Flex>
                </Tooltip>

              }
            </Tag>
          )}
        </Box>

        <Box display="flex" alignItems="center" justifyContent={'space-between'}>
          <Text size="xs" color="gray.600" fontWeight="normal">
            {t("startFrom")}
          </Text>
          <Box>
            <Flex align="center" gap={2}>
              <Text size="lg" fontWeight="bold" color="gray.800">
                {formatNumber(groupTour.price)} ֏
              </Text>
              {groupTour.priceInCurrency != null && (
                <Flex align="center">
                  <Icon name="approximate" size="12" color="gray.600" />
                  <Text size="xs" color="gray.600">
                    {formatNumber(groupTour.priceInCurrency)} {currencyLabel}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Layout >
  );
};

const Layout = ({
  children,
  link,
  ...props
}: {
  children: ReactNode | ReactNode[];
  link: string;
} & LinkProps) => (
  <LanguageLink
    to={link}
    _hover={{ textTransform: "none" }}
    width="full"
    height="100%"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  >
    <Box
      rounded="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  </LanguageLink>
);
