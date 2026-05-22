import { type PackageEntity } from "@entities/package";

export type CompareFooterBarProps = {
  selectedPackages: PackageEntity[];
  maxCompareItems: number;
  getCompareKey: (packageEntity: PackageEntity) => string;
  onRemove: (key: string) => void;
  onClear: () => void;
  onCompare: () => void;
  isHidden?: boolean;
};

export type CompareFooterContentProps = {
  selectedPackages: PackageEntity[];
  getCompareKey: (packageEntity: PackageEntity) => string;
  onRemove: (key: string) => void;
  onClear: () => void;
  onCompare: () => void;
  clearLabel: string;
  compareLabel: string;
  counterLabel?: string;
  isMobile?: boolean;
  isCompareDisabled?: boolean;
};

export type CompareFooterMobileHeaderProps = {
  counterLabel: string;
  isExpanded: boolean;
  onToggle: () => void;
};
