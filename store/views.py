from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework import status

class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        required_fields = [
            "id", "category", "item", "brand", "quantity_unit",
            "price_inr", "currency", "image_url", "stock_quantity"
        ]

        for field in required_fields:
            if field not in request.data:
                return Response({"message": f"Missing required field: '{field}'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            price = float(request.data.get("price_inr"))
        except ValueError:
            return Response({"message": "Invalid price_inr format. Must be a number."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            stock_quantity = int(request.data.get("stock_quantity"))
        except ValueError:
            return Response({"message": "Invalid stock_quantity format. Must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        if Product.objects.filter(id=request.data.get('id')).exists():
            return Response({"message": f"Product with ID '{request.data.get('id')}' already exists."}, status=status.HTTP_409_CONFLICT)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"message": "Product added successfully!", "product": serializer.data}, status=status.HTTP_201_CREATED)
