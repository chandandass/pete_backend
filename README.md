# Importing CSV Data into PostgreSQL Tables using pgAdmin 4

This guide explains how to import CSV data into the following PostgreSQL tables using pgAdmin 4:

*   `static_kid_prompt`
*   `static_family_prompt`
*   `static_reflection_prompt`

## Prerequisites

*   PostgreSQL installed and running
*   pgAdmin 4 installed
*   CSV files containing data for import

## Steps to Import Data

1.  **Open pgAdmin 4 and connect to the database.**

2.  **Navigate to the table section and expand it.**

3.  **Right-click on the specific table** (`static_kid_prompt`, `static_family_prompt`, or `static_reflection_prompt`).

4.  **(Optional) Truncate the table if it already contains data:**  If you want to replace existing data, execute the following SQL command in the query tool before importing:

    ```sql
    TRUNCATE TABLE table_name;
    ```
    (Replace `table_name` with the actual table name.)

5.  **Select "Import/Export Data" from the context menu.**

6.  **In the Import/Export Data window:**
    *   Choose the **Import** option.
    *   Click **Filename** and select the CSV file.
    *   Set **Format** to **CSV**.
    *   Click **OK** to start the import process.

7.  **Once the process is complete, the data will be available in the respective table.**
