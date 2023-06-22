import writeXlsxFile from "write-excel-file";

export const dataTable = async (fileName, data, schema) => {
    const excel = await writeXlsxFile(data, {
        schema,
        fileName,
        headerStyle: {
            backgroundColor: '#135ea2',
            color: '#ffffff',
            fontWeight: 'bold',
            align: 'center'
        },
    })

    return excel
}