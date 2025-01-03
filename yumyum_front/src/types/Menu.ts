import React from "react";

export interface Category {
  id: number;
  menuCategory: String;
  menuCategorySequence: number;
}

export interface MenuModalProps {
  modalStatus: boolean;
  closeModal: () => void;
  categories: Category[];
  fetchData: () => void;
  updateMenudata: UpdateMenu;
  updateOptionChecked: boolean[];
  setUpdateOptionChecked: React.Dispatch<React.SetStateAction<boolean[]>>
  menus: Menus[];
  selectedMenuId: number | null;
}

export interface MenuOptionDetails {
  optionDetailName: string;
  additionalFee: number;
}

export interface MenuOptions {
  optionName: string;
  optionDetails: MenuOptionDetails[];
}
export interface AddMenu {
  categoryId: number;
  menuName: string;
  imageUrl: string;
  menuDescription: string;
  menuPrice: number;
  isAvailable: boolean;
  menuOptions: MenuOptions[];
}

export interface UpdateMenu {
  categoryId : number;
  menuName: string;
  imageUrl: string;
  menuDescription: string;
  menuPrice: number;
  isAvailable: boolean;
  menuOptions: MenuOptions[];
}

export interface Menus {
  menuId: number;
  menuCategory: string;
  menuName: string;
  imageUrl: string;
  menuDescription: string;
  menuPrice: number;
  isAvailable: boolean;
  menuOptions: MenuOptions[];
}

export interface AddCategory {
  menuCategory: string;
  menuCategorySequence: number;
}