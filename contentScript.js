window.addEventListener('load', async () => {
    selectedFields = await getSelectedFields().catch((error) => {
        console.log(error.message);
    });

    // await saveSelectedFields([...selectedFields, "lior"]);
});

// For older Chrome versions that do not return a Promise when callback is not defined:
// const getSelectedFields = async () => {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get({ [SELECTED_FIELDS_KEY_NAME]: DEFAULT_FIELDS }, (result) => {
//       if (result === undefined) {
//         return reject(new Error("no selected fields available"));
//       }
//       resolve(result[SELECTED_FIELDS_KEY_NAME]);
//     });
//   });
// };
