export const defaultOption = (options: any, id: any) =>
  options.find((option: any) => option.label === id);
  
export const defaultValueOption = (options: any, id: any) =>
  options.find((option: any) => option.value === id);

export const handlePrice = (price?: any) => {
  if (price !== null && price !== undefined && price !== "") {
    const newPrice = price;
    const realPrice = newPrice.toFixed(2);
    return Number(realPrice).toLocaleString("en-US", {
    style: "currency",
    currency: "NGN",
    });
  } else {
    price = 0;
    return price?.toLocaleString("en-US", {
    style: "currency",
    currency: "NGN",
    });
  }
};

export const handleDate = (inputDate?: any) => {
  if (
    inputDate === null ||
    inputDate === undefined ||
    inputDate === "" ||
    !inputDate
  ) {
    return null;
  } else {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
};