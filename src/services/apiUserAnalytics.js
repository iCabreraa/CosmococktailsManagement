import supabase from "./supabase";

// Analytics básicos de usuarios
export async function getUserAnalytics() {
  try {
    const { data, error } = await supabase
      .from("users_new")
      .select("role, status, created_at, last_login_at");

    if (error) {
      console.error("Error loading user analytics:", error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        userGrowth: 0,
        roleDistribution: {},
        statusDistribution: {},
        recentActivity: 0,
      };
    }

    const totalUsers = data?.length || 0;
    const activeUsers =
      data?.filter(user => user.status === "active").length || 0;

    // Usuarios nuevos este mes
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth =
      data?.filter(user => new Date(user.created_at) >= thisMonth).length || 0;

    // Crecimiento de usuarios (comparar con mes anterior)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);

    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(0);
    lastMonthEnd.setHours(23, 59, 59, 999);

    const usersLastMonth =
      data?.filter(
        user =>
          new Date(user.created_at) >= lastMonth &&
          new Date(user.created_at) <= lastMonthEnd
      ).length || 0;

    const userGrowth =
      usersLastMonth > 0
        ? ((newUsersThisMonth - usersLastMonth) / usersLastMonth) * 100
        : 0;

    // Distribución por roles
    const roleDistribution =
      data?.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}) || {};

    // Distribución por estados
    const statusDistribution =
      data?.reduce((acc, user) => {
        acc[user.status] = (acc[user.status] || 0) + 1;
        return acc;
      }, {}) || {};

    // Actividad reciente (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity =
      data?.filter(
        user =>
          user.last_login_at && new Date(user.last_login_at) >= sevenDaysAgo
      ).length || 0;

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      userGrowth: Math.round(userGrowth * 100) / 100,
      roleDistribution,
      statusDistribution,
      recentActivity,
    };
  } catch (err) {
    console.error("Error in getUserAnalytics:", err);
    return {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      userGrowth: 0,
      roleDistribution: {},
      statusDistribution: {},
      recentActivity: 0,
    };
  }
}

// Analytics de engagement de usuarios
export async function getUserEngagement() {
  try {
    // Obtener usuarios
    const { data: users, error: usersError } = await supabase
      .from("users_new")
      .select("id, email, full_name, created_at, last_login_at");

    if (usersError) {
      console.error("Error loading users:", usersError);
      return {
        averageOrdersPerUser: 0,
        averageOrderValue: 0,
        mostActiveUsers: [],
        userRetention: 0,
        conversionRate: 0,
      };
    }

    // Obtener pedidos
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, user_id, total_amount, created_at, status");

    if (ordersError) {
      console.error("Error loading orders:", ordersError);
      return {
        averageOrdersPerUser: 0,
        averageOrderValue: 0,
        mostActiveUsers: [],
        userRetention: 0,
        conversionRate: 0,
      };
    }

    // Combinar datos
    const usersWithOrders =
      users?.map(user => ({
        ...user,
        orders: orders?.filter(order => order.user_id === user.id) || [],
      })) || [];

    const totalOrders = usersWithOrders.reduce(
      (sum, user) => sum + user.orders.length,
      0
    );
    const totalRevenue = usersWithOrders.reduce(
      (sum, user) =>
        sum +
        user.orders.reduce(
          (orderSum, order) => orderSum + (order.total_amount || 0),
          0
        ),
      0
    );

    const averageOrdersPerUser =
      users.length > 0 ? totalOrders / users.length : 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Usuarios más activos (por número de pedidos)
    const mostActiveUsers = users
      .map(user => ({
        id: user.id,
        name: user.full_name || user.email,
        email: user.email,
        ordersCount: user.orders.length,
        totalSpent: user.orders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        ),
        lastOrder: user.orders[0]?.created_at,
      }))
      .sort((a, b) => b.ordersCount - a.ordersCount)
      .slice(0, 10);

    // Tasa de retención (usuarios que han hecho más de 1 pedido)
    const repeatCustomers = users.filter(user => user.orders.length > 1).length;
    const userRetention =
      users.length > 0 ? (repeatCustomers / users.length) * 100 : 0;

    // Tasa de conversión (usuarios con al menos 1 pedido vs total)
    const usersWithOrdersCount = users.filter(
      user => user.orders.length > 0
    ).length;
    const conversionRate =
      users.length > 0 ? (usersWithOrdersCount / users.length) * 100 : 0;

    return {
      averageOrdersPerUser: Math.round(averageOrdersPerUser * 100) / 100,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      mostActiveUsers,
      userRetention: Math.round(userRetention * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  } catch (err) {
    console.error("Error in getUserEngagement:", err);
    return {
      averageOrdersPerUser: 0,
      averageOrderValue: 0,
      mostActiveUsers: [],
      userRetention: 0,
      conversionRate: 0,
    };
  }
}

// Analytics de segmentación de usuarios
export async function getUserSegmentation() {
  try {
    // Obtener usuarios
    const { data: users, error: usersError } = await supabase
      .from("users_new")
      .select("id, email, full_name, role, status, created_at, last_login_at");

    if (usersError) {
      console.error("Error loading users:", usersError);
      return {
        segments: {},
        highValueUsers: [],
        atRiskUsers: [],
        newUsers: [],
      };
    }

    // Obtener pedidos
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, user_id, total_amount, created_at");

    if (ordersError) {
      console.error("Error loading orders:", ordersError);
      return {
        segments: {},
        highValueUsers: [],
        atRiskUsers: [],
        newUsers: [],
      };
    }

    // Combinar datos
    const usersWithOrders =
      users?.map(user => ({
        ...user,
        orders: orders?.filter(order => order.user_id === user.id) || [],
      })) || [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Segmentar usuarios
    const segments = {
      new:
        usersWithOrders?.filter(
          user => new Date(user.created_at) >= thirtyDaysAgo
        ) || [],
      active:
        usersWithOrders?.filter(
          user =>
            user.last_login_at && new Date(user.last_login_at) >= thirtyDaysAgo
        ) || [],
      inactive:
        usersWithOrders?.filter(
          user =>
            !user.last_login_at || new Date(user.last_login_at) < thirtyDaysAgo
        ) || [],
      highValue:
        usersWithOrders?.filter(user => {
          const totalSpent =
            user.orders?.reduce((sum, order) => sum + (order.total || 0), 0) ||
            0;
          return totalSpent > 100; // Más de 100€ gastados
        }) || [],
    };

    // Usuarios de alto valor
    const highValueUsers =
      users
        ?.map(user => {
          const totalSpent =
            user.orders?.reduce((sum, order) => sum + (order.total || 0), 0) ||
            0;
          const ordersCount = user.orders?.length || 0;
          return {
            id: user.id,
            name: user.full_name || user.email,
            email: user.email,
            totalSpent,
            ordersCount,
            lastOrder: user.orders?.[0]?.created_at,
          };
        })
        .filter(user => user.totalSpent > 50)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 20) || [];

    // Usuarios en riesgo (inactivos por más de 30 días)
    const atRiskUsers =
      usersWithOrders
        ?.filter(user => {
          if (!user.last_login_at) return true;
          return new Date(user.last_login_at) < thirtyDaysAgo;
        })
        .map(user => ({
          id: user.id,
          name: user.full_name || user.email,
          email: user.email,
          lastLogin: user.last_login_at,
          daysSinceLogin: user.last_login_at
            ? Math.floor(
                (now - new Date(user.last_login_at)) / (1000 * 60 * 60 * 24)
              )
            : null,
        }))
        .sort((a, b) => (b.daysSinceLogin || 0) - (a.daysSinceLogin || 0))
        .slice(0, 20) || [];

    // Usuarios nuevos (últimos 30 días)
    const newUsers =
      usersWithOrders
        ?.filter(user => new Date(user.created_at) >= thirtyDaysAgo)
        .map(user => ({
          id: user.id,
          name: user.full_name || user.email,
          email: user.email,
          createdAt: user.created_at,
          daysSinceCreated: Math.floor(
            (now - new Date(user.created_at)) / (1000 * 60 * 60 * 24)
          ),
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 20) || [];

    return {
      segments: {
        new: segments.new.length,
        active: segments.active.length,
        inactive: segments.inactive.length,
        highValue: segments.highValue.length,
      },
      highValueUsers,
      atRiskUsers,
      newUsers,
    };
  } catch (err) {
    console.error("Error in getUserSegmentation:", err);
    return {
      segments: {},
      highValueUsers: [],
      atRiskUsers: [],
      newUsers: [],
    };
  }
}

// Analytics de tendencias temporales
export async function getUserTrends() {
  try {
    const { data: users, error } = await supabase
      .from("users_new")
      .select("created_at, last_login_at, role, status");

    if (error) {
      console.error("Error loading user trends:", error);
      return {
        monthlyGrowth: [],
        dailyActivity: [],
        roleTrends: {},
      };
    }

    // Crecimiento mensual
    const monthlyGrowth = [];
    const last12Months = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      last12Months.push(date);
    }

    last12Months.forEach(month => {
      const nextMonth = new Date(month);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const usersInMonth =
        usersWithOrders?.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate >= month && userDate < nextMonth;
        }).length || 0;

      monthlyGrowth.push({
        month: month.toLocaleDateString("es-ES", {
          month: "short",
          year: "numeric",
        }),
        users: usersInMonth,
      });
    });

    // Actividad diaria (últimos 30 días)
    const dailyActivity = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const activeUsers =
        usersWithOrders?.filter(user => {
          if (!user.last_login_at) return false;
          const loginDate = new Date(user.last_login_at);
          return loginDate >= date && loginDate < nextDay;
        }).length || 0;

      dailyActivity.push({
        date: date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
        }),
        activeUsers,
      });
    }

    // Tendencias por rol
    const roleTrends = {};
    const roles = ["customer", "admin", "staff", "manager"];

    roles.forEach(role => {
      const roleUsers = users?.filter(user => user.role === role) || [];
      const monthlyData = last12Months.map(month => {
        const nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        return roleUsers.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate >= month && userDate < nextMonth;
        }).length;
      });

      roleTrends[role] = monthlyData;
    });

    return {
      monthlyGrowth,
      dailyActivity,
      roleTrends,
    };
  } catch (err) {
    console.error("Error in getUserTrends:", err);
    return {
      monthlyGrowth: [],
      dailyActivity: [],
      roleTrends: {},
    };
  }
}
