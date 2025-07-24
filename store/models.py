from django.db import models

class Product(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    category = models.CharField(max_length=100)
    item = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    quantity_unit = models.CharField(max_length=50)
    price_inr = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    image_url = models.URLField()
    stock_quantity = models.IntegerField()

    def __str__(self):
        return f"{self.item} ({self.brand})"