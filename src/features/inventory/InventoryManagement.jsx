import React, { useState } from "react";
import styled from "styled-components";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Edit,
  Save,
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useInventory } from "./useInventory";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import Spinner from "../../ui/Spinner";

const StyledInventoryLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 2.4rem;
  margin-bottom: 2.4rem;
`;

const StatsCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const StatsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StatsLabel = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatsValue = styled.p`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-grey-900);
`;

const StatsIcon = styled.div`
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bgColor || "var(--color-grey-100)"};
  color: ${props => props.$color || "var(--color-grey-600)"};
`;

const InventoryTable = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  grid-column: 1 / -1;
`;

const TableHeader = styled.div`
  padding: 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  background: var(--color-grey-50);
`;

const TableTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 0.4rem;
`;

const TableSubtitle = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: var(--color-grey-50);
`;

const TableHeaderCell = styled.th`
  padding: 1.6rem 2.4rem;
  text-align: left;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--color-grey-100);
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--color-grey-100);
    transition: background-color 0.2s;

    &:hover {
      background: var(--color-grey-50);
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const TableCell = styled.td`
  padding: 1.6rem 2.4rem;
  font-size: 1.4rem;
  color: var(--color-grey-700);
`;

const CocktailName = styled.div`
  font-weight: 600;
  color: var(--color-grey-900);
`;

const SizeInfo = styled.div`
  color: var(--color-grey-600);
`;

const Price = styled.div`
  font-weight: 600;
  color: var(--color-green-700);
`;

const StockInput = styled.input`
  width: 8rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
  text-align: center;
  background: var(--color-grey-0);
  color: var(--color-grey-900);

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
`;

const StockValue = styled.div`
  font-weight: 600;
  color: var(--color-grey-900);
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius-full);
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.$bgColor || "var(--color-grey-100)"};
  color: ${props => props.$color || "var(--color-grey-600)"};
  border: 1px solid ${props => props.$borderColor || "var(--color-grey-200)"};
`;

const ActionButton = styled.button`
  padding: 0.8rem;
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: var(--color-grey-600);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--color-grey-100);
    color: var(--color-grey-900);
  }

  &.save {
    color: var(--color-green-600);
    &:hover {
      background: var(--color-green-50);
      color: var(--color-green-700);
    }
  }

  &.cancel {
    color: var(--color-red-600);
    &:hover {
      background: var(--color-red-50);
      color: var(--color-red-700);
    }
  }

  &.edit {
    color: var(--color-brand-600);
    &:hover {
      background: var(--color-brand-50);
      color: var(--color-brand-700);
    }
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Legend = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-lg);
  padding: 2.4rem;
  margin-top: 2.4rem;
  box-shadow: var(--shadow-sm);
`;

const LegendTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 1.6rem;
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  gap: 1.6rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const LegendDot = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background: ${props => props.$color || "var(--color-grey-400)"};
`;

const LegendText = styled.span`
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const InventoryManagement = () => {
  const { inventory, loading, error, updateStock, refreshInventory } =
    useInventory();

  const [editingItem, setEditingItem] = useState(null);
  const [stockValue, setStockValue] = useState("");

  const handleEdit = item => {
    console.log("🔍 ITEM COMPLETO PARA EDITAR:", item);
    console.log("🔍 COCKTAIL_ID:", item.cocktail_id);
    console.log("🔍 SIZE_ID:", item.size_id);
    console.log("🔍 COCKTAIL:", item.cocktails);
    console.log("🔍 SIZE:", item.sizes);

    // Obtener los IDs correctos - verificar múltiples fuentes
    const cocktailId = item.cocktail_id || item.cocktails?.id;
    const sizeId = item.size_id || item.sizes?.id;

    console.log("🔍 IDs CORREGIDOS:");
    console.log("   - cocktailId:", cocktailId);
    console.log("   - sizeId:", sizeId);

    if (!cocktailId || !sizeId) {
      console.error("❌ ERROR: No se pudieron obtener los IDs necesarios");
      console.error("   - cocktailId:", cocktailId);
      console.error("   - sizeId:", sizeId);
      return;
    }

    // Usar un separador único que no esté en los UUIDs
    const itemKey = `${cocktailId}|||${sizeId}`;
    console.log("🔍 ITEM KEY GENERADO:", itemKey);

    setEditingItem(itemKey);
    setStockValue(item.stock_quantity?.toString() || "0");
  };

  const handleSave = async item => {
    const newStock = parseInt(stockValue) || 0;

    // Obtener los IDs correctos del item
    const cocktailId = item.cocktail_id || item.cocktails?.id;
    const sizeId = item.size_id || item.sizes?.id;

    if (!cocktailId || !sizeId) {
      console.error("❌ ERROR: No se pudieron obtener los IDs para guardar");
      return;
    }

    const itemId = `${cocktailId}|||${sizeId}`;
    console.log("🔍 HANDLE SAVE - ItemId:", itemId);
    await updateStock(itemId, newStock);
    setEditingItem(null);
    setStockValue("");
  };

  const handleCancel = () => {
    setEditingItem(null);
    setStockValue("");
  };

  const getStockStatus = stock => {
    if (stock === null || stock === undefined) return "unknown";
    if (stock === 0) return "out";
    if (stock < 10) return "low";
    return "good";
  };

  const getStatusConfig = status => {
    switch (status) {
      case "out":
        return {
          bgColor: "var(--color-red-50)",
          color: "var(--color-red-700)",
          borderColor: "var(--color-red-200)",
          icon: <AlertTriangle className="w-4 h-4" />,
          text: "Sin Stock",
        };
      case "low":
        return {
          bgColor: "var(--color-yellow-50)",
          color: "var(--color-yellow-700)",
          borderColor: "var(--color-yellow-200)",
          icon: <TrendingDown className="w-4 h-4" />,
          text: "Stock Bajo",
        };
      case "good":
        return {
          bgColor: "var(--color-green-50)",
          color: "var(--color-green-700)",
          borderColor: "var(--color-green-200)",
          icon: <TrendingUp className="w-4 h-4" />,
          text: "En Stock",
        };
      default:
        return {
          bgColor: "var(--color-grey-50)",
          color: "var(--color-grey-600)",
          borderColor: "var(--color-grey-200)",
          icon: <Package className="w-4 h-4" />,
          text: "Sin Datos",
        };
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <Heading
          as="h3"
          style={{ color: "var(--color-red-700)", marginBottom: "1.6rem" }}
        >
          Error de conexión
        </Heading>
        <p style={{ color: "var(--color-grey-600)", marginBottom: "2.4rem" }}>
          {error}
        </p>
        <button
          onClick={refreshInventory}
          style={{
            padding: "1.2rem 2.4rem",
            backgroundColor: "var(--color-red-600)",
            color: "white",
            border: "none",
            borderRadius: "var(--border-radius-sm)",
            cursor: "pointer",
            fontSize: "1.4rem",
            fontWeight: "500",
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Calcular estadísticas
  const stats = {
    total: inventory.length,
    inStock: inventory.filter(
      item => getStockStatus(item.stock_quantity) === "good"
    ).length,
    lowStock: inventory.filter(
      item => getStockStatus(item.stock_quantity) === "low"
    ).length,
    outOfStock: inventory.filter(
      item => getStockStatus(item.stock_quantity) === "out"
    ).length,
  };

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Gestión de Inventario</Heading>
        <button
          onClick={refreshInventory}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            padding: "1.2rem 2.4rem",
            backgroundColor: "var(--color-brand-600)",
            color: "white",
            border: "none",
            borderRadius: "var(--border-radius-sm)",
            cursor: "pointer",
            fontSize: "1.4rem",
            fontWeight: "500",
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </Row>

      <StyledInventoryLayout>
        <StatsCard>
          <StatsContent>
            <StatsLabel>Total Productos</StatsLabel>
            <StatsValue>{stats.total}</StatsValue>
          </StatsContent>
          <StatsIcon
            $bgColor="var(--color-brand-100)"
            $color="var(--color-brand-600)"
          >
            <Package className="w-6 h-6" />
          </StatsIcon>
        </StatsCard>

        <StatsCard>
          <StatsContent>
            <StatsLabel>En Stock</StatsLabel>
            <StatsValue>{stats.inStock}</StatsValue>
          </StatsContent>
          <StatsIcon
            $bgColor="var(--color-green-100)"
            $color="var(--color-green-600)"
          >
            <CheckCircle className="w-6 h-6" />
          </StatsIcon>
        </StatsCard>

        <StatsCard>
          <StatsContent>
            <StatsLabel>Stock Bajo</StatsLabel>
            <StatsValue>{stats.lowStock}</StatsValue>
          </StatsContent>
          <StatsIcon
            $bgColor="var(--color-yellow-100)"
            $color="var(--color-yellow-600)"
          >
            <TrendingDown className="w-6 h-6" />
          </StatsIcon>
        </StatsCard>

        <StatsCard>
          <StatsContent>
            <StatsLabel>Sin Stock</StatsLabel>
            <StatsValue>{stats.outOfStock}</StatsValue>
          </StatsContent>
          <StatsIcon
            $bgColor="var(--color-red-100)"
            $color="var(--color-red-600)"
          >
            <AlertTriangle className="w-6 h-6" />
          </StatsIcon>
        </StatsCard>
      </StyledInventoryLayout>

      <InventoryTable>
        <TableHeader>
          <TableTitle>Inventario Detallado</TableTitle>
          <TableSubtitle>Gestiona el stock de cada producto</TableSubtitle>
        </TableHeader>

        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Cóctel</TableHeaderCell>
              <TableHeaderCell>Tamaño</TableHeaderCell>
              <TableHeaderCell>Precio</TableHeaderCell>
              <TableHeaderCell>Stock Actual</TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {inventory.map((item, index) => {
              const stockStatus = getStockStatus(item.stock_quantity);
              const statusConfig = getStatusConfig(stockStatus);
              // Obtener los IDs correctos para la comparación
              const cocktailId = item.cocktail_id || item.cocktails?.id;
              const sizeId = item.size_id || item.sizes?.id;
              const isEditing = editingItem === `${cocktailId}|||${sizeId}`;

              return (
                <tr key={`${item.cocktail_id}-${item.size_id}-${index}`}>
                  <TableCell>
                    <CocktailName>{item.cocktails.name}</CocktailName>
                  </TableCell>
                  <TableCell>
                    <SizeInfo>
                      {item.sizes.name} ({item.sizes.volume_ml}ml)
                    </SizeInfo>
                  </TableCell>
                  <TableCell>
                    <Price>€{item.price?.toFixed(2) || "0.00"}</Price>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <StockInput
                        type="number"
                        value={stockValue}
                        onChange={e => setStockValue(e.target.value)}
                        min="0"
                      />
                    ) : (
                      <StockValue>
                        {item.stock_quantity ?? "Sin datos"}
                      </StockValue>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      $bgColor={statusConfig.bgColor}
                      $color={statusConfig.color}
                      $borderColor={statusConfig.borderColor}
                    >
                      {statusConfig.icon}
                      {statusConfig.text}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <ActionGroup>
                        <ActionButton
                          className="save"
                          onClick={() => handleSave(item)}
                        >
                          <Save className="w-4 h-4" />
                        </ActionButton>
                        <ActionButton className="cancel" onClick={handleCancel}>
                          <X className="w-4 h-4" />
                        </ActionButton>
                      </ActionGroup>
                    ) : (
                      <ActionButton
                        className="edit"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </ActionButton>
                    )}
                  </TableCell>
                </tr>
              );
            })}
          </TableBody>
        </Table>
      </InventoryTable>

      <Legend>
        <LegendTitle>Leyenda de Estados</LegendTitle>
        <LegendGrid>
          <LegendItem>
            <LegendDot $color="var(--color-green-500)" />
            <LegendText>En Stock: Más de 10 unidades disponibles</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendDot $color="var(--color-yellow-500)" />
            <LegendText>
              Stock Bajo: Entre 1 y 9 unidades disponibles
            </LegendText>
          </LegendItem>
          <LegendItem>
            <LegendDot $color="var(--color-red-500)" />
            <LegendText>Sin Stock: 0 unidades disponibles</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendDot $color="var(--color-grey-500)" />
            <LegendText>Sin Datos: No se ha configurado el stock</LegendText>
          </LegendItem>
        </LegendGrid>
      </Legend>
    </>
  );
};

export default InventoryManagement;
