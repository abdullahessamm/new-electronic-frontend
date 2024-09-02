import writeXlsxFile from "write-excel-file";

export const dataTable = async (fileName, data, schema, sheets) => {
    const excel = await writeXlsxFile(data, {
        schema,
        fileName,
        sheets,
        headerStyle: {
            backgroundColor: '#135ea2',
            color: '#ffffff',
            fontWeight: 'bold',
            align: 'center'
        },
    })

    return excel
}