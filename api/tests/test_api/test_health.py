import pytest


@pytest.mark.asyncio
async def test_stocks_basic(client):
    response = client.get("/api/health")
    assert response.status_code == 200
