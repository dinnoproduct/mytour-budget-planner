import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useUserContext } from "@entities/user";
import { useHotelReviews } from "@/entities/notification";
import { useModalContext } from "@app/providers";
import { RefObject, useEffect, useRef, useState } from "react";
import { formatRate } from "./helpers";
import { ReviewMediaStrip } from "./components/ReviewMediaStrip";
import { ReviewCard } from "./components/ReviewCard";
import { ReviewSummary } from "./components/ReviewSummary";
import { HorizontalScrollButtons } from "./components/HorizontalScrollButtons";
import { ReviewMediaModal } from "./components/ReviewMediaModal";
import { Text } from "@ui";

type GuestReviewsProps = { hotelId?: number };

export const GuestReviews = ({
    hotelId,
}: GuestReviewsProps) => {
    const { t } = useTranslation();
    const { user } = useUserContext();
    const { dispatchModal } = useModalContext();
    const { data: hotelReviews } = useHotelReviews(hotelId ?? 0);
    const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});
    const mediaRowRef = useRef<HTMLDivElement | null>(null);
    const reviewsRowRef = useRef<HTMLDivElement | null>(null);
    const [mediaCanScrollLeft, setMediaCanScrollLeft] = useState(false);
    const [mediaCanScrollRight, setMediaCanScrollRight] = useState(false);
    const [reviewsCanScrollLeft, setReviewsCanScrollLeft] = useState(false);
    const [reviewsCanScrollRight, setReviewsCanScrollRight] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [modalMedias, setModalMedias] = useState<{ url: string; mediaType: number }[]>([]);
    const [modalInitialIndex, setModalInitialIndex] = useState(0);
    const [isAllReviewsDrawerOpen, setIsAllReviewsDrawerOpen] = useState(false);

    const handleWriteReviewClick = () => {
        if (!user) {
            dispatchModal({
                type: "open",
                modalType: "auth",
                props: { view: "signIn" },
            });
            return;
        }

        // Logged-in review flow will be connected here.
    };

    const allMedias = hotelReviews?.reviews?.flatMap((review) => review.mediaFiles) ?? [];
    const visibleReviews =
        hotelReviews?.reviews?.filter(
            (review) =>
                review.reviewDescription.length > 0 || review.mediaFiles.length > 0
        ) ?? [];
    const REVIEW_TOGGLE_THRESHOLD = 120;
    const SCROLL_STEP = 470;

    const ratingRows = [
        { key: t`food`, value: formatRate(hotelReviews?.averageRatings?.food) },
        { key: t`cleanliness`, value: formatRate(hotelReviews?.averageRatings?.cleanliness) },
        { key: t`location`, value: formatRate(hotelReviews?.averageRatings?.location) },
    ];
    const horizontalScrollbarSx = {
        scrollbarWidth: "thin",
        scrollbarColor: "gray.200 transparent",
        "&::-webkit-scrollbar": {
            height: "4px",
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            background: "gray.200",
            borderRadius: "999px",
        },
    };

    const openMediaModal = (
        medias: { url: string; mediaType: number }[],
        index: number
    ) => {
        if (!medias?.length) return;
        setModalMedias(medias);
        setModalInitialIndex(index);
        setIsMediaModalOpen(true);
    };

    const updateScrollState = (
        rowRef: RefObject<HTMLDivElement | null>,
        setCanScrollLeft: (value: boolean) => void,
        setCanScrollRight: (value: boolean) => void
    ) => {
        const node = rowRef.current;
        if (!node) return;

        const maxScrollableLeft = node.scrollWidth - node.clientWidth;
        setCanScrollLeft(node.scrollLeft > 0);
        setCanScrollRight(node.scrollLeft < maxScrollableLeft - 1);
    };

    const scrollRow = (
        rowRef: RefObject<HTMLDivElement | null>,
        direction: "left" | "right"
    ) => {
        const node = rowRef.current;
        if (!node) return;

        node.scrollBy({
            left: direction === "left" ? -SCROLL_STEP : SCROLL_STEP,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const mediaNode = mediaRowRef.current;
        const reviewsNode = reviewsRowRef.current;

        const updateMedia = () =>
            updateScrollState(mediaRowRef, setMediaCanScrollLeft, setMediaCanScrollRight);
        const updateReviews = () =>
            updateScrollState(
                reviewsRowRef,
                setReviewsCanScrollLeft,
                setReviewsCanScrollRight
            );

        updateMedia();
        updateReviews();

        mediaNode?.addEventListener("scroll", updateMedia);
        reviewsNode?.addEventListener("scroll", updateReviews);
        window.addEventListener("resize", updateMedia);
        window.addEventListener("resize", updateReviews);

        return () => {
            mediaNode?.removeEventListener("scroll", updateMedia);
            reviewsNode?.removeEventListener("scroll", updateReviews);
            window.removeEventListener("resize", updateMedia);
            window.removeEventListener("resize", updateReviews);
        };
    }, [allMedias.length, hotelReviews?.reviews?.length]);

    return (
        <Flex direction="column" gap="8">
            <ReviewSummary
                totalRate={formatRate(hotelReviews?.averageRatings?.total ?? 0)}
                reviewsLabel={t("reviews", { count: hotelReviews?.reviews?.length ?? 0 })}
                rows={ratingRows}
                onWriteReview={handleWriteReviewClick}
                writeReviewLabel={t("writeReview")}
            />

            {allMedias.length > 0 && (
                <Flex direction="column" gap="4">
                    <ReviewMediaStrip
                        medias={allMedias}
                        size="large"
                        containerRef={mediaRowRef}
                        scrollbarSx={horizontalScrollbarSx}
                        onImageClick={(index) => openMediaModal(allMedias, index)}
                    />
                    <Flex justifyContent="flex-end">
                        <HorizontalScrollButtons
                            canScrollLeft={mediaCanScrollLeft}
                            canScrollRight={mediaCanScrollRight}
                            onScrollLeft={() => scrollRow(mediaRowRef, "left")}
                            onScrollRight={() => scrollRow(mediaRowRef, "right")}
                        />
                    </Flex>
                </Flex>
            )}

            <Flex
                direction="column"
                gap="4"
            >
                <Flex
                    ref={reviewsRowRef}
                    gap="2"
                    overflowX="auto"
                    sx={horizontalScrollbarSx}
                >
                    {visibleReviews.map((review) => {
                        const isExpanded = !!expandedReviews[review.id];
                        const shouldShowToggle =
                            (review.reviewDescription || "").length > REVIEW_TOGGLE_THRESHOLD;

                        return (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                isExpanded={isExpanded}
                                shouldShowToggle={shouldShowToggle}
                                onToggleExpand={() =>
                                    setExpandedReviews((prev) => ({
                                        ...prev,
                                        [review.id]: !prev[review.id],
                                    }))
                                }
                                onMediaClick={(index) =>
                                    openMediaModal(review.mediaFiles, index)
                                }
                            />
                        );
                    })}
                </Flex>
                {visibleReviews.length > 0 && (
                    <Flex justifyContent="space-between" alignItems="center">
                        <Button
                            variant="outline-blue"
                            width={{ base: "100%", md: "auto" }}
                            size="sm"
                            onClick={() => setIsAllReviewsDrawerOpen(true)}
                        >
                            {t("showAll")}
                        </Button>
                        <HorizontalScrollButtons
                            canScrollLeft={reviewsCanScrollLeft}
                            canScrollRight={reviewsCanScrollRight}
                            onScrollLeft={() => scrollRow(reviewsRowRef, "left")}
                            onScrollRight={() => scrollRow(reviewsRowRef, "right")}
                        />
                    </Flex>
                )}
            </Flex>
            <ReviewMediaModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                medias={modalMedias}
                initialIndex={modalInitialIndex}
            />
            <Drawer
                isOpen={isAllReviewsDrawerOpen}
                placement="right"
                onClose={() => setIsAllReviewsDrawerOpen(false)}
                size="full"
            >
                <DrawerOverlay />
                <DrawerContent
                    w={{ base: "100%", md: "50%" }}
                    maxW={{ base: "100%", md: "50%" }}
                >
                    <DrawerHeader borderBottomWidth="1px" borderColor="gray.100">
                        <Flex align="center" justify="space-between">
                            <Flex direction="column" gap="1">
                                <Text fontSize="20px" fontWeight="700" color="gray.900">
                                    {t("grades")}
                                </Text>
                                <Text fontSize="12px" fontWeight="500" color="gray.600">
                                    {t("reviews", { count: visibleReviews.length })}
                                </Text>
                            </Flex>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsAllReviewsDrawerOpen(false)}
                            >
                                ✕
                            </Button>
                        </Flex>
                    </DrawerHeader>
                    <DrawerBody p="4">
                        <Flex direction="column" gap="3" overflowY="auto">
                            {visibleReviews.map((review) => {
                                const isExpanded = !!expandedReviews[review.id];
                                const shouldShowToggle =
                                    (review.reviewDescription || "").length >
                                    REVIEW_TOGGLE_THRESHOLD;

                                return (
                                    <ReviewCard
                                        key={`drawer-${review.id}`}
                                        review={review}
                                        isExpanded={isExpanded}
                                        shouldShowToggle={shouldShowToggle}
                                        isFullWidth
                                        onToggleExpand={() =>
                                            setExpandedReviews((prev) => ({
                                                ...prev,
                                                [review.id]: !prev[review.id],
                                            }))
                                        }
                                        onMediaClick={(index) =>
                                            openMediaModal(review.mediaFiles, index)
                                        }
                                    />
                                );
                            })}
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Flex>
    );
};
