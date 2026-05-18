import { Box, Grid } from "@chakra-ui/react";
import { type LayoutProps, RequestsGroupStatus } from "./types";
import { Container, Heading, Tabs } from "@ui";
import { useUserRequestsManager } from "@widgets/UserPackages/hooks";
import { RequestCard } from "@widgets/UserPackages/ui/RequestCard";
import {
  CanceledTabEmptyState,
  IncompleteTabEmptyState,
  PastTabEmptyState,
  UpcomingTabEmptyState,
} from "@widgets/UserPackages/ui/EmptyStates";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { bookingContextAtom, isLateCheckoutAtom } from "@/modules/packages/store/store";
import { useEffect, useRef, useState } from "react";
import { useLanguageNavigate } from "@/hooks/useLanguageNavigate";
import {
  RequestStatus,
  transformRequestToPackage,
  useBookPackage,
} from "@entities/package";
import { useUserContext } from "@entities/user";

export const UserPackages = () => {
  const { t } = useTranslation();
  const setIsLateCheckout = useSetRecoilState(isLateCheckoutAtom);
  const setBookingContext = useSetRecoilState(bookingContextAtom);
  const { navigateToBooking, navigateToPayment, navigateToBookingResult } = useLanguageNavigate();
  const { user } = useUserContext();
  const { mutateAsync: bookPackageAsync } = useBookPackage();
  const [bookingZeroRequestId, setBookingZeroRequestId] = useState<number | null>(null);
  const hasNavigatedRef = useRef(false);
  const {
    activeRequests,
    pendingRequests,
    cancelledRequests,
    passedRequests,
    isLoadingRemainingPayment,
    currentRequestId,
    handleCancelClick,
    cancellingRequestId,
    tab,
    handleTabChange,
    isLoadingUserRequests,
    handleContinueClick,
    activeRequest,
    handleBookingFlowClose,
    activeRequestPackage,
    incompleteInitialView,
    isActiveRequestDraft,
    isLoadingActiveRequestPackage,
  } = useUserRequestsManager();

  useEffect(() => {
    if (activeRequest?.notes.isLateCheckout !== undefined) {
      setIsLateCheckout(activeRequest.notes.isLateCheckout);
    }
  }, [activeRequest?.notes.isLateCheckout, setIsLateCheckout]);

  useEffect(() => {
    if (!activeRequest) {
      hasNavigatedRef.current = false;
    }
  }, [activeRequest]);
  // When user already booked/reserved (no down payment) → go to payment page from step 1
  useEffect(() => {
    if (!activeRequest || hasNavigatedRef.current) return;

    const shouldOpenPaymentForm =
      activeRequest.status === RequestStatus.NotPaid ||
      activeRequest.status === RequestStatus.Reserved;
    const shouldOpenRemainingPayment =
      activeRequest.status === RequestStatus.Booked;

    if (shouldOpenPaymentForm || shouldOpenRemainingPayment) {
      const packageDetails =
        activeRequestPackage ?? transformRequestToPackage(activeRequest);
      const travelersFromNotes = activeRequest.notes?.travelers as
        | { adults: { firstName?: string; lastName?: string; dateOfBirth?: string }[]; children: { firstName?: string; lastName?: string; dateOfBirth?: string }[] }
        | undefined
      const normTravelers = (arr: { firstName?: string; lastName?: string; dateOfBirth?: string }[] = []) =>
        arr.map((t) => ({
          firstName: t.firstName ?? "",
          lastName: t.lastName ?? "",
          dateOfBirth: t.dateOfBirth ?? "",
        }))
      const defaultTravelers = travelersFromNotes
        ? {
            adults: normTravelers(travelersFromNotes.adults),
            children: normTravelers(travelersFromNotes.children),
          }
        : activeRequest.travelers
          ? {
              adults: activeRequest.travelers.map((t) => ({
                firstName: t.firstName,
                lastName: t.lastName,
                dateOfBirth: t.dateOfBirth ?? "",
              })),
              children: [],
            }
          : undefined
      hasNavigatedRef.current = true;
      navigateToPayment({
        state: {
          mode: shouldOpenRemainingPayment ? "remainingOnly" : undefined,
          packageDetails,
          request: activeRequest,
          travelers: defaultTravelers,
        },
      });
      handleBookingFlowClose();
      return;
    }

    // Draft or other → go to booking page when package is ready
    // Group tours use CreateGroupTourOffer (no offerId); hotel/package use generateOffers (offerId)
    const isGroupTour =
      activeRequestPackage &&
      !(activeRequestPackage as any).hotel &&
      (activeRequestPackage as any).departures &&
      (activeRequestPackage as any).agency
    const hasValidPackage =
      (activeRequestPackage?.offerId || isGroupTour) && !isLoadingActiveRequestPackage

    if (hasValidPackage) {
      hasNavigatedRef.current = true;
      setBookingContext({
        packageDetails: activeRequestPackage,
        childrenAges: activeRequest.notes?.childrenAges || [],
        initialView: incompleteInitialView,
        request: activeRequest,
        defaultTravelers: (() => {
          const travelersFromNotes = activeRequest.notes?.travelers as
            | { adults: { firstName: string; lastName: string; dateOfBirth?: string }[]; children: { firstName: string; lastName: string; dateOfBirth?: string }[] }
            | undefined
          if (travelersFromNotes) {
            const norm = (arr: { firstName?: string; lastName?: string; dateOfBirth?: string }[] = []) =>
              arr.map((t) => ({
                firstName: t.firstName ?? "",
                lastName: t.lastName ?? "",
                dateOfBirth: t.dateOfBirth ?? "",
              }))
            return {
              adults: norm(travelersFromNotes.adults),
              children: norm(travelersFromNotes.children),
            }
          }
          if (activeRequest.travelers) {
            return {
              adults: activeRequest.travelers.map((t) => ({
                firstName: t.firstName,
                lastName: t.lastName,
                dateOfBirth: t.dateOfBirth ?? "",
              })),
              children: [],
            }
          }
          return undefined
        })(),
        isBooked: !isActiveRequestDraft,
      });
      navigateToBooking();
      handleBookingFlowClose();
    }
  }, [
    activeRequest,
    activeRequestPackage,
    isLoadingActiveRequestPackage,
    incompleteInitialView,
    isActiveRequestDraft,
    setBookingContext,
    navigateToBooking,
    navigateToPayment,
    handleBookingFlowClose,
  ]);

  const handleRemainingPaymentClick = async (
    request: any,
    promo?: { code: string; discountedFullPrice: number },
  ) => {
    const shouldOpenPaymentForm =
      request.status === RequestStatus.NotPaid ||
      request.status === RequestStatus.Reserved;

    if (promo?.code && (promo.discountedFullPrice ?? 0) <= 0) {
      const packageDetails = transformRequestToPackage(request) as any;
      const travelers = (request.travelers ?? []).map((traveler: any) => ({
        firstName: traveler.firstName ?? "",
        lastName: traveler.lastName ?? "",
        dateOfBirth: traveler.dateOfBirth ?? "",
      }));

      const bookInput: any = {
        requestId: request.id,
        cityId: packageDetails.city.id,
        price: packageDetails.price,
        hotelId: packageDetails.hotel.id,
        travelAgencyId: packageDetails.travelAgency.id,
        offerId: packageDetails.offerId,
        roomType: packageDetails.roomType,
        email: user?.email ?? "",
        notes: JSON.stringify(request.notes ?? {}),
        phoneNumber: user?.phoneNumber ?? "",
        amountToBePaid: 0,
        usdRate: packageDetails.usdRate,
        currency: packageDetails.currency,
        rate: packageDetails.rate,
        travelers,
        paymentSystem: "VPos",
        promoCode: promo.code,
      };

      if (packageDetails.destinationFlight?.departureDate) {
        bookInput.startDate = packageDetails.destinationFlight.departureDate;
        bookInput.endDate = packageDetails.returnFlight.departureDate;
        bookInput.destinationFlightId = packageDetails.destinationFlight.id;
        bookInput.returnFlightId = packageDetails.returnFlight.id;
        bookInput.bookingType = 1;
      } else {
        bookInput.startDate = packageDetails.checkin;
        bookInput.endDate = packageDetails.checkout;
        bookInput.bookingType = 2;
        bookInput.foodType = packageDetails.foodType ?? 0;
      }

      try {
        setBookingZeroRequestId(request.id);
        const res = await bookPackageAsync(bookInput);
        if (!res?.success) {
          navigateToBookingResult({ error: true, replace: true, fromPayment: true });
          return;
        }
        navigateToBookingResult({ success: true, replace: true, fromPayment: true });
      } catch {
        navigateToBookingResult({ error: true, replace: true, fromPayment: true });
      } finally {
        setBookingZeroRequestId(null);
      }
      return;
    }

    navigateToPayment({
      state: {
        mode: shouldOpenPaymentForm ? undefined : "remainingOnly",
        request,
        packageDetails: transformRequestToPackage(request),
        discountedFullPrice: promo?.discountedFullPrice,
        promoCode: promo?.code,
      },
    });
  };

  return (
    <Layout>
      <Heading size="sm-md">{t`myPackages`}</Heading>

      <Tabs
        align="start"
        labels={[t`upcoming`, t`incomplete`, t`past`, t`canceled`]}
        mt="10"
        index={tab}
        onChange={handleTabChange}
        groupAlign="flex-start"
        isDisabled={isLoadingUserRequests}
      >
        {!activeRequests?.length ? (
          <UpcomingTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {activeRequests.map((request) => (
              <RequestCard
                request={request}
                key={request.id}
                onRemainingPaymentClick={handleRemainingPaymentClick}
                isLoadingRemainingPayment={
                  (currentRequestId === request.id && isLoadingRemainingPayment) ||
                  bookingZeroRequestId === request.id
                }
                onCancelClick={handleCancelClick}
                status={RequestsGroupStatus.Upcoming}
                isLoadingContinue={
                  request.id === activeRequest?.id &&
                  isLoadingActiveRequestPackage
                }
                onContinueClick={handleContinueClick}
                cancellingRequestId={cancellingRequestId}
              />
            ))}
          </TabContentLayout>
        )}

        {!pendingRequests?.length ? (
          <IncompleteTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {pendingRequests.map((request) => (
              <RequestCard
                request={request}
                key={request.id}
                onRemainingPaymentClick={handleRemainingPaymentClick}
                onCancelClick={handleCancelClick}
                status={RequestsGroupStatus.Incomplete}
                onContinueClick={handleContinueClick}
                isLoadingContinue={
                  request.id === activeRequest?.id &&
                  isLoadingActiveRequestPackage
                }
                isLoadingRemainingPayment={bookingZeroRequestId === request.id}
                cancellingRequestId={cancellingRequestId}
              />
            ))}
          </TabContentLayout>
        )}

        {!passedRequests?.length ? (
          <PastTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {passedRequests.map((request) => (
              <RequestCard
                request={request}
                key={request.id}
                status={RequestsGroupStatus.Past}
              />
            ))}
          </TabContentLayout>
        )}

        {!cancelledRequests?.length ? (
          <CanceledTabEmptyState isLoading={isLoadingUserRequests} />
        ) : (
          <TabContentLayout>
            {cancelledRequests.map((request) => (
              <RequestCard
                request={request}
                key={request.id}
                status={RequestsGroupStatus.Canceled}
              />
            ))}
          </TabContentLayout>
        )}
      </Tabs>
    </Layout>
  );
};

const TabContentLayout = ({ children }: LayoutProps) => (
  <Grid
    templateColumns={{
      base: "1fr",
      md: "repeat(4, minmax(240px, 1fr))",
    }}
    columnGap={{ base: 4, lg: 6 }}
    rowGap="4"
    justifyItems={{ base: "center", md: "stretch" }}
  >
    {children}
  </Grid>
);

const Layout = ({ children }: LayoutProps) => (
  <Box py={{ base: 6, md: 10 }}>
    <Container>{children}</Container>
  </Box>
);

