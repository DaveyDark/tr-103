import pytest


def get_stock_data_from_api(client):
    """Helper function to get stock data from the stocks endpoint"""
    stocks_response = client.get(
        "/api/stocks",
        params={
            "ticker": "AAPL",
            "start_date": "2024-01-01",
            "end_date": "2024-01-31",
        },
    )

    if stocks_response.status_code != 200:
        pytest.skip("Stocks endpoint unavailable for test")

    stock_data = stocks_response.json()

    if not stock_data or len(stock_data) < 3:
        pytest.skip("Insufficient stock data for test")

    return stock_data


@pytest.mark.asyncio
async def test_forecast_endpoint_success(client):
    """Test that forecast endpoint returns 200 with valid request"""
    stock_data = get_stock_data_from_api(client)
    request_data = {"stock_data": stock_data, "days": 5}

    response = client.post("/api/forecast", json=request_data)

    assert response.status_code == 200
    forecast_data = response.json()

    # Verify response format
    assert isinstance(forecast_data, list)
    assert len(forecast_data) > 0

    # Verify basic structure of forecast response
    first_item = forecast_data[0]
    required_fields = ["ds", "yhat", "yhat_lower", "yhat_upper"]
    for field in required_fields:
        assert field in first_item


@pytest.mark.asyncio
async def test_forecast_endpoint_with_default_days(client):
    """Test forecast endpoint without days parameter uses default"""
    stock_data = get_stock_data_from_api(client)
    request_data = {"stock_data": stock_data}

    response = client.post("/api/forecast", json=request_data)

    assert response.status_code == 200
    forecast_data = response.json()
    assert isinstance(forecast_data, list)
    assert len(forecast_data) > 0


@pytest.mark.asyncio
async def test_forecast_endpoint_empty_stock_data(client):
    """Test forecast endpoint with empty stock data returns 400"""
    request_data = {"stock_data": [], "days": 5}

    response = client.post("/api/forecast", json=request_data)

    assert response.status_code == 400
    error_data = response.json()
    assert "detail" in error_data
    assert "empty" in error_data["detail"].lower()


@pytest.mark.asyncio
async def test_forecast_endpoint_missing_stock_data(client):
    """Test forecast endpoint with missing stock_data field returns 422"""
    request_data = {"days": 5}

    response = client.post("/api/forecast", json=request_data)

    assert response.status_code == 422
