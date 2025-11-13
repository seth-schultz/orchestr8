---
id: sqlserver-tsql-procedures
category: example
tags: [sql-server, t-sql, stored-procedures, transactions, error-handling]
capabilities:
  - Stored procedures with error handling
  - Table-valued parameters for bulk operations
  - MERGE statements for upserts
  - Window functions for analytics
useWhen:
  - Building efficient SQL Server stored procedures
  - Implementing transactional business logic
  - Bulk data operations with type safety
  - Complex analytical queries with window functions
estimatedTokens: 1100
relatedResources:
  - orchestr8://agents/sqlserver-specialist
---

# SQL Server T-SQL Stored Procedures

## Overview
Comprehensive T-SQL patterns for stored procedures, including error handling, bulk operations, and advanced query techniques.

## Implementation

```sql
-- Efficient stored procedure with error handling
CREATE OR ALTER PROCEDURE usp_CreateOrder
    @UserID INT,
    @Items NVARCHAR(MAX), -- JSON array
    @TotalAmount DECIMAL(10,2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @OrderID INT;

        -- Insert order
        INSERT INTO Orders (UserID, OrderDate, Status)
        VALUES (@UserID, GETDATE(), 'Pending');

        SET @OrderID = SCOPE_IDENTITY();

        -- Insert order items from JSON
        INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price)
        SELECT
            @OrderID,
            ProductID,
            Quantity,
            Price
        FROM OPENJSON(@Items)
        WITH (
            ProductID INT '$.productId',
            Quantity INT '$.quantity',
            Price DECIMAL(10,2) '$.price'
        );

        -- Calculate total
        SELECT @TotalAmount = SUM(Quantity * Price)
        FROM OrderItems
        WHERE OrderID = @OrderID;

        -- Update order total
        UPDATE Orders
        SET TotalAmount = @TotalAmount
        WHERE OrderID = @OrderID;

        COMMIT TRANSACTION;

        RETURN @OrderID;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO

-- Use table-valued parameters for bulk operations
CREATE TYPE dbo.OrderItemType AS TABLE (
    ProductID INT,
    Quantity INT,
    Price DECIMAL(10,2)
);
GO

CREATE OR ALTER PROCEDURE usp_CreateOrderBulk
    @UserID INT,
    @Items OrderItemType READONLY
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderID INT;

    INSERT INTO Orders (UserID, OrderDate)
    VALUES (@UserID, GETDATE());

    SET @OrderID = SCOPE_IDENTITY();

    INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price)
    SELECT @OrderID, ProductID, Quantity, Price
    FROM @Items;

    RETURN @OrderID;
END;
GO

-- Efficient MERGE for upsert operations
MERGE INTO Users AS target
USING (VALUES
    (1, 'john@example.com', 'John Doe'),
    (2, 'jane@example.com', 'Jane Smith')
) AS source (UserID, Email, Name)
ON target.UserID = source.UserID
WHEN MATCHED THEN
    UPDATE SET
        Email = source.Email,
        Name = source.Name,
        UpdatedDate = GETDATE()
WHEN NOT MATCHED THEN
    INSERT (UserID, Email, Name, CreatedDate)
    VALUES (source.UserID, source.Email, source.Name, GETDATE())
OUTPUT $action, inserted.UserID;

-- Window functions for analytics
SELECT
    UserID,
    OrderDate,
    Amount,
    SUM(Amount) OVER (PARTITION BY UserID ORDER BY OrderDate) as RunningTotal,
    AVG(Amount) OVER (PARTITION BY UserID ORDER BY OrderDate
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as MovingAvg,
    ROW_NUMBER() OVER (PARTITION BY UserID ORDER BY Amount DESC) as RankByAmount,
    FIRST_VALUE(Amount) OVER (PARTITION BY UserID ORDER BY OrderDate) as FirstOrder,
    LAG(Amount, 1) OVER (PARTITION BY UserID ORDER BY OrderDate) as PrevAmount
FROM Orders;
```

## Usage Notes

**Error Handling:**
- `SET XACT_ABORT ON` - Automatically rollback on errors
- `TRY...CATCH` - Structured exception handling
- `THROW` - Re-throw error with original details
- Always check `@@TRANCOUNT` before rollback

**Table-Valued Parameters:**
- Define custom table types for bulk inserts
- Strongly typed and compiled for performance
- Use `READONLY` to prevent modification
- Better than CSV or XML for bulk operations

**MERGE Statement:**
- Single statement for insert/update logic
- Atomic operation with full ACID compliance
- Use `OUTPUT` clause to track changes
- More efficient than separate INSERT/UPDATE

**Window Functions:**
- `PARTITION BY` - Group data for calculations
- `ORDER BY` - Define calculation order
- `ROWS BETWEEN` - Define frame for moving calculations
- No GROUP BY needed - returns all rows
