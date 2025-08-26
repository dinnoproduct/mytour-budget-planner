import { useRecoilState } from 'recoil';
import { bookingDrawerAtom } from '../store/store';
import { type PackageEntity } from '@entities/package';

export const useBookingDrawer = () => {
  const [bookingDrawer, setBookingDrawer] = useRecoilState(bookingDrawerAtom);

  const openBookingDrawer = (packageData: PackageEntity, childrenAges: number[] = []) => {
    setBookingDrawer({
      isOpen: true,
      packageData,
      childrenAges,
      selectedMealPlan: 0,
      selectedRoomPackageId: null
    });
  };

  const closeBookingDrawer = () => {
    setBookingDrawer({
      isOpen: false,
      packageData: null,
      childrenAges: [],
      selectedMealPlan: 0,
      selectedRoomPackageId: null
    });
  };

  const updateChildrenAges = (childrenAges: number[]) => {
    setBookingDrawer(prev => ({
      ...prev,
      childrenAges
    }));
  };

  const updateMealPlan = (selectedMealPlan: number) => {
    setBookingDrawer(prev => ({
      ...prev,
      selectedMealPlan
    }));
  };

  const updateSelectedRoomPackage = (packageId: string) => {
    setBookingDrawer(prev => ({
      ...prev,
      selectedRoomPackageId: packageId
    }));
  };

  return {
    isOpen: bookingDrawer.isOpen,
    packageData: bookingDrawer.packageData,
    childrenAges: bookingDrawer.childrenAges,
    selectedMealPlan: bookingDrawer.selectedMealPlan,
    selectedRoomPackageId: bookingDrawer.selectedRoomPackageId,
    openBookingDrawer,
    closeBookingDrawer,
    updateChildrenAges,
    updateMealPlan,
    updateSelectedRoomPackage,
    
  };
};
