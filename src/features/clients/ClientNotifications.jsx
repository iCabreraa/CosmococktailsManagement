import styled from "styled-components";
import { useState, useEffect } from "react";
import { HiOutlineBell, HiXMark, HiOutlineCheckCircle } from "react-icons/hi2";

const NotificationContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  max-width: 400px;
`;

const Notification = styled.div`
  background: ${props => {
    switch (props.type) {
      case "success":
        return "var(--color-green-50)";
      case "warning":
        return "var(--color-yellow-50)";
      case "error":
        return "var(--color-red-50)";
      default:
        return "var(--color-blue-50)";
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.type) {
        case "success":
          return "var(--color-green-200)";
        case "warning":
          return "var(--color-yellow-200)";
        case "error":
          return "var(--color-red-200)";
        default:
          return "var(--color-blue-200)";
      }
    }};
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const NotificationIcon = styled.div`
  color: ${props => {
    switch (props.type) {
      case "success":
        return "var(--color-green-600)";
      case "warning":
        return "var(--color-yellow-600)";
      case "error":
        return "var(--color-red-600)";
      default:
        return "var(--color-blue-600)";
    }
  }};
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 0.5rem;
`;

const NotificationMessage = styled.div`
  color: var(--color-grey-700);
  font-size: 1.4rem;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-grey-500);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;

  &:hover {
    background: var(--color-grey-100);
    color: var(--color-grey-700);
  }
`;

const NotificationTypes = {
  NEW_CLIENT: {
    type: "success",
    title: "Nuevo Cliente",
    message: "Se ha registrado un nuevo cliente en el sistema",
    icon: HiOutlineCheckCircle,
  },
  CLIENT_UPDATE: {
    type: "info",
    title: "Cliente Actualizado",
    message: "Los datos del cliente han sido actualizados correctamente",
    icon: HiOutlineBell,
  },
  ERROR: {
    type: "error",
    title: "Error",
    message: "Ha ocurrido un error al procesar la solicitud",
    icon: HiXMark,
  },
};

function ClientNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notificationType, customMessage = null) => {
    const notification = {
      id: Date.now(),
      ...NotificationTypes[notificationType],
      message: customMessage || NotificationTypes[notificationType].message,
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = id => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Expose addNotification globally for use in other components
  useEffect(() => {
    window.addClientNotification = addNotification;
    return () => {
      delete window.addClientNotification;
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <NotificationContainer>
      {notifications.map(notification => {
        const IconComponent = notification.icon;
        return (
          <Notification key={notification.id} type={notification.type}>
            <NotificationIcon type={notification.type}>
              <IconComponent size={20} />
            </NotificationIcon>
            <NotificationContent>
              <NotificationTitle>{notification.title}</NotificationTitle>
              <NotificationMessage>{notification.message}</NotificationMessage>
            </NotificationContent>
            <CloseButton onClick={() => removeNotification(notification.id)}>
              <HiXMark size={16} />
            </CloseButton>
          </Notification>
        );
      })}
    </NotificationContainer>
  );
}

export default ClientNotifications;
