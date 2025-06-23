import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import { formatCurrency } from '@/utils/formatters';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

const PropertyCard = ({ 
  property, 
  onViewDetails, 
  onPurchase, 
  showActions = true,
  apiBaseUrl = '' 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Tersedia':
        return 'success';
      case 'Terjual':
        return 'error';
      default:
        return 'default';
    }
  };

  const primaryImage = property.images?.[0] 
    ? `${apiBaseUrl}${property.images[0]}`
    : '/images/teras_jawi.jpg';

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={primaryImage}
        alt={property.property_name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', flex: 1 }}>
            {property.property_name}
          </Typography>
          <Chip 
            label={property.status} 
            color={getStatusColor(property.status)}
            size="small"
          />
        </Box>
        
        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
          {property.type_name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SquareFootIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {property.sq_meter} m²
          </Typography>
        </Box>
        
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>
          {formatCurrency(property.price)}
        </Typography>
        
        {property.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {property.description}
          </Typography>
        )}
      </CardContent>
      
      {showActions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button 
            size="small" 
            onClick={() => onViewDetails?.(property)}
            sx={{ mr: 1 }}
          >
            Lihat Detail
          </Button>
          {property.status === 'Tersedia' && (
            <Button 
              size="small" 
              variant="contained" 
              onClick={() => onPurchase?.(property)}
            >
              Beli Sekarang
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default PropertyCard;