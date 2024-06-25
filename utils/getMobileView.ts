export function getMobileView(orderKey:string, data:any) {
    let order;
    for (const key in data) {
      if (data[key].referenceUid == orderKey) order = data[key]?.data;
    }
    //console.log(order);
    const unorderedArray = data[orderKey] || [];
  
    // Create a map of uids to items for fast lookup
    const uidToItemMap:any = {};
    unorderedArray.forEach((item:any) => {
      const uid = item[Object.keys(item)[0]]._metadata.uid;
      uidToItemMap[uid] = item;
    });
  
    // Reorder the array based on the order specified and hidden
    const orderedArray = order
      .map((obj:any) => {
        const key = Object.keys(obj)[0]; // Extract the key from the object
        const item = uidToItemMap[obj[key].uid]; // Get the item from uidToItemMap
        return item && !obj[key].hidden ? item : null; // Return the item only if it's not hidden
      })
      .filter((item:any) => item); // Filter out any falsy values
      data[orderKey]=orderedArray;
    return data;
  }
  