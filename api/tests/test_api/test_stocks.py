import pytest


@pytest.mark.asyncio
async def test_stocks_basic(client):
    response = client.get(
        "/api/stocks",
        params={"ticker": "TSLA", "start_date": "2022-01-01", "end_date": "2022-01-31"},
    )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_stocks_invalid_ticker(client):
    response = client.get(
        "/api/stocks",
        params={
            "ticker": "INVALID",
            "start_date": "2022-01-01",
            "end_date": "2022-01-31",
        },
    )
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_stocks_missing_params(client):
    response = client.get("/api/stocks")
    assert response.status_code == 422
